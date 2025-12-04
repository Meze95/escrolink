export interface Transaction {
  id: string;
  seller: string;
  buyer: string;
  amount: string;
  product: string;
  status: 'completed' | 'pending' | 'disputed' | 'refunded';
  date: string;
}