export type DashboardResponse = {
  today: {
    totalOrders: number;
    pending: number;
    outForDelivery: number;
    delivered: number;
    online: number;
    cod: number;
    cancelled: number;
  };
  earnings: {
    todaySales: number;
    monthlySales: number;
  };
  payouts: {
    nextPayoutAmount: number | null;
    nextPayoutDate: string | null;
    lastPayoutAmount: number | null;
    lastPayoutDate: string | null;
    status: 'NONE' | 'PENDING' | 'COMPLETED';
  };
  products: {
    totalListedProducts: number;
    approvedProducts: number;
    pendingProducts: number;
    subscriptionAvailableProducts: number;
  };
};
