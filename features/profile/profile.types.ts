export type VendorProfile = {
  id: string;
  vendorNo: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  is_active: boolean;
  is_available_today: boolean;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  created_at: string;
  updated_at: string;
};
