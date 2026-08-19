export type MenuCategory = "entree" | "plat" | "dessert" | "boisson";
export type OrderStatus =
  | "nouvelle"
  | "en_preparation"
  | "prete"
  | "servie"
  | "annulee";
export type ReservationStatus = "en_attente" | "confirmee" | "annulee";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
}

export interface MenuItemOption {
  id: string;
  menu_item_id: string;
  label: string;
  extra_price: number;
  sort_order: number;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  table_label: string | null;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  order_id: string | null;
  rating: number;
  customer_name: string | null;
  comment: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  option_id: string | null;
  quantity: number;
  unit_price: number;
  notes: string | null;
}
