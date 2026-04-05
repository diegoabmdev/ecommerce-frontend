import React from "react";
import Tittles from "./Tittles";
import { FeaturedProductsGrid } from "../product/FeaturedProductsGrid";

export const NewsSection = () => {
  return (
    <section className="container mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <Tittles title="Novedades" badge="Últimas" />
      </div>
      <FeaturedProductsGrid limit={6} />
    </section>
  );
};
