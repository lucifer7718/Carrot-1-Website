import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        comparePrice: true,
        images: true,
        sizes: true,
        stockQuantity: true,
        featured: true,
        inStock: true,
        slug: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET_SINGLE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
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

    let imageUrls = existingProduct.images || [];

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

    const nextSlugBase = slugify(name);
    let nextSlug = nextSlugBase;
    let slugCounter = 1;

    while (true) {
      const existingSlugProduct = await prisma.product.findUnique({
        where: { slug: nextSlug },
        select: { id: true },
      });

      if (!existingSlugProduct || existingSlugProduct.id === id) {
        break;
      }

      nextSlug = `${nextSlugBase}-${slugCounter}`;
      slugCounter += 1;
    }

    const categorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
      where: {
        slug: categorySlug,
      },
      update: {
        name: categoryName,
      },
      create: {
        name: categoryName,
        slug: categorySlug,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: nextSlug,
        description,
        price,
        comparePrice,
        images: imageUrls,
        sizes,
        stockQuantity,
        featured,
        inStock,
        categoryId: category.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${existingProduct.slug}`);
    revalidatePath(`/products/${nextSlug}`);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}