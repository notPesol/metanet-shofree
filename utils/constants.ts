export const transactionTypeOptions = [
  {
    label: "Deposit",
    value: "deposit",
  },
  {
    label: "Withdraw",
    value: "withdraw",
  },
];
export const orderStatusOptions = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Paid",
    value: "paid",
  },
];

export enum CartItemAssociationView {
  cartItemProduct = "cart-item-product",
}

export const mapOrderStatus = {
  pending: 'Pending',
  paid: 'Paid',
}

export enum OrderItemAssociationView {
  orderItemProduct = "order-item-product",
}
