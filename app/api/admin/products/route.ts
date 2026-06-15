import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function isAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin-auth");
  const adminPassword = process.env.ADMIN_PASSWORD;
  return adminCookie && adminCookie.value === adminPassword;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        stockQuantity: true,
        inStock: true,
        featured: true,
        createdAt: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const price = Number(formData.get("price"));
    const comparePriceValue = String(formData.get("comparePrice") || "").trim();
    const comparePrice = comparePriceValue ? Number(comparePriceValue) : null;
    const categoryName = String(formData.get("categoryName") || "").trim();
    const stockQuantity = Number(formData.get("stockQuantity"));
    const featured = String(formData.get("featured")) === "true";
    const inStock = String(formData.get("inStock")) === "true";
    const sizes = formData
      .getAll("sizes")
      .map((item) => String(item).trim().toUpperCase())
      .filter(Boolean);

    const image = formData.get("image") as File | null;

    if (!name || !description || !categoryName) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid number" },
        { status: 400 }
      );
    }

    if (comparePrice !== null && (Number.isNaN(comparePrice) || comparePrice < 0)) {
      return NextResponse.json(
        { success: false, message: "Compare price must be a valid number" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      return NextResponse.json(
        { success: false, message: "Stock quantity must be a valid number" },
        { status: 400 }
      );
    }

    if (sizes.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one size is required" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = image.type || "image/jpeg";
        imageUrl = `data:${mimeType};base64,${base64}`;
      } catch {
        return NextResponse.json(
          { success: false, message: "Image processing failed" },
          { status: 500 }
        );
      }
    }

    const baseProductSlug = slugify(name);
    let finalProductSlug = baseProductSlug;
    let productCounter = 1;

    while (
      await prisma.product.findUnique({
        where: { slug: finalProductSlug },
        select: { id: true },
      })
    ) {
      finalProductSlug = `${baseProductSlug}-${productCounter}`;
      productCounter += 1;
    }

    const baseCategorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
      where: { slug: baseCategorySlug },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug: baseCategorySlug,
      },
    });

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalProductSlug,
        description,
        price,
        comparePrice,
        images: imageUrl ? [imageUrl] : [],
        categoryId: category.id,
        sizes,
        featured,
        inStock,
        stockQuantity,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        category: { select: { name: true } },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const id = String(formData.get("id") || "");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, images: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const price = Number(formData.get("price"));
    const comparePriceValue = String(formData.get("comparePrice") || "").trim();
    const comparePrice = comparePriceValue ? Number(comparePriceValue) : null;
    const categoryName = String(formData.get("categoryName") || "").trim();
    const stockQuantity = Number(formData.get("stockQuantity"));
    const featured = String(formData.get("featured")) === "true";
    const inStock = String(formData.get("inStock")) === "true";
    const sizes = formData
      .getAll("sizes")
      .map((item) => String(item).trim().toUpperCase())
      .filter(Boolean);

    const image = formData.get("image") as File | null;

    if (!name || !description || !categoryName) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid number" },
        { status: 400 }
      );
    }

    if (comparePrice !== null && (Number.isNaN(comparePrice) || comparePrice < 0)) {
      return NextResponse.json(
        { success: false, message: "Compare price must be a valid number" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      return NextResponse.json(
        { success: false, message: "Stock quantity must be a valid number" },
        { status: 400 }
      );
    }

    if (sizes.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one size is required" },
        { status: 400 }
      );
    }

    let imageUrls = existing.images;

    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = image.type || "image/jpeg";
        imageUrls = [`data:${mimeType};base64,${base64}`];
      } catch {
        return NextResponse.json(
          { success: false, message: "Image processing failed" },
          { status: 500 }
        );
      }
    }

    const baseCategorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
      where: { slug: baseCategorySlug },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug: baseCategorySlug,
      },
    });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        comparePrice,
        images: imageUrls,
        categoryId: category.id,
        sizes,
        featured,
        inStock,
        stockQuantity,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        category: { select: { name: true } },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${existing.slug}`);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE_PRODUCT_ERROR", error);

    if (error.code === "P2003" || error.code === "P2014") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete this product because it has already been ordered. Hide it instead by setting it to out of stock.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}