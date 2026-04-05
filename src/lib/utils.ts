import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

// Conversión de USD a CLP (tasa aproximada)
const USD_TO_CLP = 950;

export function convertUSDtoCLP(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_CLP);
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number,
): number {
  if (!originalPrice || !discountedPrice || originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
