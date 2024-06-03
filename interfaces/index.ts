export interface IWallet {
  id: number;
  userId: number;
  balance: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  username: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: IWallet;
}

export type TransactionType = "deposit" | "withdraw" | "payment";

export interface ICreateWalletTransaction {
  transactionType: TransactionType;
  amount: number;
}

export interface ITransaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: null;
  price: number;
  stock: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCartItem {
  userId?: number;
  productId?: number;
  quantity?: number;
}

export interface ICartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  product?: IProduct;
}

export type OrderStatus = "pending" | "paid";
// | "shipped"
// | "completed"
// | "cancelled";

export interface IOrder {
  id: number;
  userId: number;
  totalAmount: string;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems?: IOrderItem[];
}

export interface ITableHeader {
  label: string;
  key: string;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  product?: IProduct;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface IResponse<T> {
  message: string;
  totalItem: number;
  data: T;
}
