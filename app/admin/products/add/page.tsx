"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!formData.name.trim()) {
        setError("Please enter product name");
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError("Please enter product description");
        setLoading(false);
        return;
      }

      if (!formData.categoryName.trim()) {
        setError("Please enter category name");
        setLoading(false);
        return;
      }

      if (!formData.price || Number(formData.price) < 0) {
        setError("Please enter a valid price");
        setLoading(false);
        return;
      }

      if (formData.comparePrice && Number(formData.comparePrice) < 0) {
        setError("Please enter a valid compare price");
        setLoading(false);
        return;
      }

      if (!formData.stockQuantity || Number(formData.stockQuantity) < 0) {
        setError("Please enter a valid stock quantity");
        setLoading(false);
        return;
      }

      if (!imageFile) {
        setError("Please upload a product image");
        setLoading(false);
        return;
      }

      if (selectedSizes.length === 0) {
        setError("Please select at least one size");
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("price", formData.price);
      payload.append("comparePrice", formData.comparePrice);
      payload.append("categoryName", formData.categoryName.trim());
      payload.append("stockQuantity", formData.stockQuantity);
      payload.append("featured", String(formData.featured));
      payload.append("inStock", String(formData.inStock));
      payload.append("image", imageFile);

      selectedSizes.forEach((size) => {
        payload.append("sizes", size);
      });

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create product");
        setLoading(false);
        return;
      }

      setMessage("Product created successfully");

      setFormData({
        name: "",
        description: "",
        price: "",
        comparePrice: "",
        categoryName: "",
        stockQuantity: "0",
        featured: false,
        inStock: true,
      });

      setSelectedSizes([]);
      setImageFile(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong while creating the product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1f1f1f]">Add Product</h1>
        <p className="mt-2 text-sm text-[#666]">
          Create a new product and save it to your database.
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
              placeholder="Example: Carrot Oversized T-Shirt"
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
              placeholder="Write product description"
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
              placeholder="999"
              min="0"
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
              placeholder="1299"
              min="0"
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
              placeholder="T-Shirts"
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
              placeholder="10"
              min="0"
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none focus:border-[#C8470A]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#333]">
              Upload Product Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-[#ddd6cb] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#C8470A] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#a63b08]"
              required
            />
            <p className="mt-2 text-xs text-[#777]">
              Upload one product image from your computer.
            </p>

            {imagePreview ? (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-28 w-28 rounded-xl border border-[#ece6dd] object-cover"
                />
              </div>
            ) : null}
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

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#C8470A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a63b08] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  );
}