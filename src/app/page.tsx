// app/page.tsx
import { Hero } from "@/components/hero/HeroSection";
import { BenefitsSection } from "@/components/hero/BenefitsSection";
import { CategoryGrid } from "@/components/hero/CategoryGrid";
import { FlashSales } from "@/components/hero/FlashSales";
import { Widget } from "@/components/hero/Widget";
import { NewsSection } from "@/components/hero/NewsSection";
import { Promotional } from "@/components/hero/Promotional";
import { BestSellers } from "@/components/hero/BestSellers";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Hero />
      <div className="max-w-340 px-4 lg:px-10 mx-auto space-y-20 mt-12">
        <BenefitsSection />
        <CategoryGrid />
        <FlashSales />
        <Widget />
        <NewsSection />
        <Promotional />
        <BestSellers />
      </div>
    </div>
  );
}
