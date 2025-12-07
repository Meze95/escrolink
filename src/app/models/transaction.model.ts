export interface BuyerDetails {
  firstName: string;
  lastName: string;
  tel: string;
  email: string;
}

export interface DeliveryDetails {
  deliveryType: 'home' | 'pickup';
  fullAddress: string;
  addressLine2?: string;
  state: string;
  country: string;
}

export interface TransactionProduct {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  seller: string;
  buyer: BuyerDetails;
  delivery: DeliveryDetails;
  products: TransactionProduct[];
  totalAmount: number;
  status: 'completed' | 'pending' | 'paid' |  'disputed' | 'refunded';
  date: string;
}