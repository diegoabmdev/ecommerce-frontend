"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ShoppingCart, Heart, Truck, ShieldCheck,
  Zap, CheckCircle2, ChevronRight, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/types";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import Link from "next/link";
import { FeaturedProductsGrid } from "./FeaturedProductsGrid";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.thumbnail);

  const priceCLP = convertUSDtoCLP(product.price);
  const isFavorite = isInWishlist(product.id);
  const oldPrice = priceCLP / (1 - product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. NAVEGACIÓN SUPERIOR */}
      <header className="border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link href="/products" className="hover:text-indigo-600 transition-colors">Catálogo</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 italic">{product.category}</span>
          </nav>
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* 2. ÁREA VISUAL (COL 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-4/5 md:aspect-square bg-[#F8FAFC] rounded-[4rem] overflow-hidden border border-slate-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative w-full h-full p-12 md:p-24"
                >
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.discountPercentage > 0 && (
                <div className="absolute top-10 left-10 bg-slate-950 text-white px-6 py-2 rounded-2xl font-black text-xs italic">
                  SAVE {Math.round(product.discountPercentage)}%
                </div>
              )}
            </div>

            {/* Galería de Miniaturas */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center md:justify-start">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all p-2 bg-slate-50 shrink-0 ${selectedImage === img ? "border-indigo-600 scale-105 shadow-xl shadow-indigo-100" : "border-transparent opacity-50"
                    }`}
                >
                  <Image src={img} alt="preview" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. ÁREA DE COMPRA (COL 5) */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-8">
              <div>
                <Badge className="bg-indigo-600 text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4">
                  {product.brand}
                </Badge>
                <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase italic leading-[0.85] mb-6">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">({product.rating} Rating)</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-6xl font-black text-slate-950 tracking-tighter">{formatCLP(priceCLP)}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-xl text-slate-300 line-through font-bold">{formatCLP(oldPrice)}</span>
                )}
              </div>

              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => addToCart(product)}
                  className="flex-1 h-20 bg-indigo-600 hover:bg-slate-950 text-white rounded-[2rem] text-xl font-black uppercase italic shadow-2xl shadow-indigo-200 transition-all active:scale-95"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" /> Añadir al carrito
                </Button>
                <Button
                  onClick={() => toggleWishlist(product)}
                  variant="outline"
                  className={`h-20 w-20 rounded-[2rem] border-slate-100 ${isFavorite ? "bg-rose-50 text-rose-500 border-rose-100" : "text-slate-300"}`}
                >
                  <Heart className={`h-8 w-8 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Bento Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard icon={<Truck />} title="Fast Delivery" desc="Free over $50k" />
                <InfoCard icon={<ShieldCheck />} title="1 Year Warranty" desc="Tech Protection" />
              </div>

              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-bold">
                <CheckCircle2 className="h-5 w-5" />
                {product.stock} units ready for immediate shipping
              </div>
            </div>
          </div>
        </div>

        {/* 4. SECCIÓN TÉCNICA (Bento Layout) */}
        <section className="mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">

              {/* Specs */}
              <div>
                <SectionTitle number="01" title="Technical Specs" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mt-8">
                  <SpecItem label="Weight" value={`${product.weight}g`} />
                  <SpecItem label="Dimensions" value={`${product.dimensions.width}x${product.dimensions.height}cm`} />
                  <SpecItem label="Warranty" value={product.warrantyInformation} />
                  <SpecItem label="SKU" value={product.sku} />
                </div>
              </div>

              {/* Reviews */}
              <div>
                <SectionTitle number="02" title="Expert Reviews" />
                <div className="space-y-6 mt-8">
                  {product.reviews.map((review, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      key={i}
                      className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-black uppercase italic text-sm">{review.reviewerName}</div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, s) => <Star key={s} className={`w-3 h-3 ${s < review.rating ? 'fill-current' : ''}`} />)}
                        </div>
                      </div>
                      <p className="text-slate-600 italic font-medium">"{review.comment}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indigo Sidebar Sticky */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-slate-950 p-10 rounded-[3.5rem] text-white">
                <Zap className="text-indigo-500 w-12 h-12 mb-6" />
                <h3 className="text-3xl font-black uppercase italic leading-none mb-6">Nova<span className="text-indigo-500">Cart</span></h3>
                <ul className="space-y-8 mb-10">
                  <BenefitItem text="Experiencia certificada" />
                  <BenefitItem text="24/7 Soporte Premium" />
                  <BenefitItem text="Membrecia exclusiva" />
                </ul>
                <Button className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white py-8 rounded-2xl font-black uppercase italic transition-all">
                  Unete al club
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RELACIONADOS */}
        <section className="mt-32">
          <SectionTitle number="03" title="Related Gear" />
          <div className="mt-12">
            <FeaturedProductsGrid limit={4} category={product.category} />
          </div>
        </section>
      </main>
    </div>
  );
}

// Sub-componentes internos
const InfoCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
    <div className="text-indigo-600 mb-3">{icon}</div>
    <div className="font-black uppercase italic text-xs mb-1">{title}</div>
    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{desc}</div>
  </div>
);

const SpecItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between py-4 border-b border-slate-100">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-sm font-black italic uppercase">{value}</span>
  </div>
);

const SectionTitle = ({ number, title }: { number: string, title: string }) => (
  <div className="flex items-center gap-4">
    <span className="text-indigo-600 font-black italic text-xl">{number}/</span>
    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">{title}</h2>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <li className="flex gap-4">
    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
    <p className="text-sm font-bold text-slate-300">{text}</p>
  </li>
);