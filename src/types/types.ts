//Productos
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

//Filtros
export interface FilterState {
  category: string;
  brand: string;
  priceRange: [number, number];
  sort: SortOption;
  search: string;
}

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "title";

//Navbar
export interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

//User/Auth
export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  age?: number;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "female" | "male" | "other" | "";
  image: string;
}

export interface User extends AuthUser {
  maidenName?: string;
  age?: number;
  phone?: string;
  birthDate?: string;
  bloodGroup?: string;
  height?: number | null;
  weight?: number | null;
  eyeColor?: string;
  ip?: string;
  address?: FullAddress;
  macAddress?: string;
  university?: string;
  bank?: Bank;
  ein?: string;
  ssn?: string;
  userAgent?: string;
  role: "admin" | "user" | "moderator";
}

export interface FullAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  country: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  link: string;
  tag?: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
  items: any[];
}