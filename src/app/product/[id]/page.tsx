// src/app/product/[id]/page.tsx
import { productService } from "@/services/productService";
import ProductDetail from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await productService.getProductById(Number(id));
  
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.title} | Indigo Shop`,
    description: product.description,
    openGraph: {
      images: [product.thumbnail],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = await productService.getProductById(Number(id));

  if (!product) notFound();
  return <ProductDetail key={id} product={product} />;
}