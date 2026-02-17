export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  deposit?: number;
  is_active: boolean;
  is_schedulable: boolean;
  categoryId: string;
  images?: string[];
  approval_status: 'APPROVED' | 'PENDING';
};
