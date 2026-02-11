export type Order = {
  id: string;
  orderNo: string;
  total_amount: string;
  payment_status: string;
  payment_mode: string;
  delivery_status: string;
  created_at: string;
  assigned_rider_phone: string | null;
  otp_verified: boolean;
  address: {
    label: string;
    address: string;
    pincode: string;
  };
};

export type OrdersResponse = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
