"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category?: {
    name: string;
  } | null;
  images: string[];
  sizes: string[];
  stockQuantity: number;
  featured: boolean;
  inStock: boolean;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryName: "",
    stockQuantity: "0",
    featured: false,
    inStock: true,
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load product");
          setLoading(false);
          return;
        }

        const product: Product = data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          comparePrice: product.comparePrice ? String(product.comparePrice) : "",
          categoryName: product.category?.name || "",
          stockQuantity: String(product.stockQuantity ?? 0),
          featured: product.featured ?? false,
          inStock: product.inStock ?? true,
        });

        setSelectedSizes(product.sizes || []);
        setExistingImage(product.images?.[0] || "");
      } catch {
        setError("Something went wrong while loading product");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSizeChange(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (selectedSizes.length === 0) {
        setError("Please select at least one size");
        setSaving(false);
        return;
      }

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("comparePrice", formData.comparePrice);
      payload.append("categoryName", formData.categoryName);
      payload.append("stockQuantity", formData.stockQuantity);
      payload.append("featured", String(formData.featured));
      payload.append("inStock", String(formData.inStock));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      selectedSizes.forEach((size) => {
        payload.append("sizes", size);
      });

      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update product");
        setSaving(false);
        return;
      }

      setMessage("Product updated successfully");

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } catch {
      setError("Something went wrong while updating the product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">Edit Product</h1>
          <p className="mt-2 text-sm text-[#666]">Loading product details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Edit Product</h1>
        <p className="mt-2 text-sm text-[#666]">
          Update product details, stock, sizes, and image.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Compare Price
            </label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Current Image
            </label>
            {existingImage ? (
              <img
                src={existingImage}
                alt="Current product"
                className="h-32 w-32 rounded-xl border border-[#ddd6cb] object-cover"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-[#ddd6cb] px-4 py-6 text-sm text-[#777]">
                No image available
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Replace Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#a63b08]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-3 block text-sm font-medium text-[#333]">
              Sizes
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {ALL_SIZES.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2 rounded-xl border border-[#ece6dd] p-3 text-sm text-[#333]"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="h-4 w-4"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#ece6dd] p-4">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="featured" className="text-sm font-medium text-[#333]">
              Featured Product
            </label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#ece6dd] p-4">
            <input
              id="inStock"
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-[#333]">
              In Stock
            </label>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#C8470A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Updating Product..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-[#ddd6cb] px-6 py-3 text-sm font-semibold text-[#333] transition hover:bg-[#faf7f2]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}