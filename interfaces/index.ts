export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}

export type TransactionType = "deposit" | "withdraw" | "payment";

export interface CreateWalletTransaction {
  transactionType: TransactionType;
  amount: number;
}

export interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: null;
  price: number;
  stock: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartItem {
  userId?: number;
  productId?: number;
  quantity?: number;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export type OrderStatus = "pending" | "paid";
// | "shipped"
// | "completed"
// | "cancelled";

export interface Order {
  id: number;
  userId: number;
  totalAmount: string;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
