import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import fs from "fs/promises";
import path from "path";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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

    if (!image || image.size === 0) {
      return NextResponse.json(
        { success: false, message: "Product image is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, safeFileName);

    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${safeFileName}`;

    const baseProductSlug = slugify(name);
    let finalProductSlug = baseProductSlug;
    let productCounter = 1;

    while (
      await prisma.product.findUnique({
        where: { slug: finalProductSlug },
      })
    ) {
      finalProductSlug = `${baseProductSlug}-${productCounter}`;
      productCounter += 1;
    }

    const baseCategorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
      where: {
        slug: baseCategorySlug,
      },
      update: {
        name: categoryName,
      },
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
        images: [imageUrl],
        categoryId: category.id,
        sizes,
        featured,
        inStock,
        stockQuantity,
      },
      include: {
        category: true,
      },
    });

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}