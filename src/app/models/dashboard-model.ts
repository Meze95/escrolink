export interface StatCard {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export interface Transaction {
  id: string;
  buyer: string;
  amount: string;
  status: 'completed' | 'pending' | 'shipped' | 'disputed';
  date: string;
  product: string;
}

export interface MonthData {
  month: string;
  transactions: number;
  revenue: number;
}