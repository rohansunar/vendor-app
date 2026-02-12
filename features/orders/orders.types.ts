export type OrderItem = {
  id: string;
  price: string;
  quantity: number;
  product: {
    name: string;
  };
};

export type Order = {
  id: string;
  orderNo: string;
  total_amount: string;
  payment_status: string;
  payment_mode: string;
  delivery_status: string;
  created_at: string;
  assigned_rider_phone: string | null;
  orderItems: OrderItem[];
  address: {
    address: string;
    pincode: string;
    location: {
      name: string;
      state: string;
    };
  };

  cancelReason?: string | null;
  cancelledAt?: string | null;
  rider?: {
    id: string;
    name: string;
    phone: string;
  };
  confirmation_method?: 'OTP' | 'PHOTO';
  confirmation_otp?: string;
  confirmation_image?: string;
};

export type OrdersResponse = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
