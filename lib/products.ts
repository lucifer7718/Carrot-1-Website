export type ProductSize = "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  imageLabel: string;
  description: string;
  featured: boolean;
  availableSizes: ProductSize[];
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: string;
  imageLabel: string;
  size: ProductSize;
  quantity: number;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "carrot-tee-01",
    name: "Carrot Tee 01",
    price: "₹799",
    imageLabel: "Tee 01",
    description:
      "A premium everyday T-shirt designed for comfort, clean styling, and versatile wear. Built for daily use with a refined Carrot aesthetic.",
    featured: true,
    availableSizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  },
  {
    id: 2,
    slug: "carrot-tee-02",
    name: "Carrot Tee 02",
    price: "₹849",
    imageLabel: "Tee 02",
    description:
      "A clean and comfortable essential with a minimal look, soft feel, and easy styling for daily wear.",
    featured: true,
    availableSizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  },
  {
    id: 3,
    slug: "carrot-tee-03",
    name: "Carrot Tee 03",
    price: "₹899",
    imageLabel: "Tee 03",
    description:
      "A refined Carrot T-shirt made for a premium everyday wardrobe with balanced comfort and modern simplicity.",
    featured: true,
    availableSizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  },
];