import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
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
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
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

    let imageUrl = existingProduct.images?.[0] || "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const safeFileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeFileName);

      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${safeFileName}`;
    }

    const nextSlugBase = slugify(name);
    let nextSlug = nextSlugBase;
    let slugCounter = 1;

    while (true) {
      const existingSlugProduct = await prisma.product.findUnique({
        where: { slug: nextSlug },
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
        images: imageUrl ? [imageUrl] : [],
        sizes,
        stockQuantity,
        featured,
        inStock,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

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