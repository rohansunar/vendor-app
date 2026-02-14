export type Address = {
  id: string; // UUID format
  is_active: boolean;
  pincode: string;
  address: string;
  isServiceable: boolean;
  location: {
    name: string; // City
    state: string;
    lat: number;
    lng:number;
  };
  createdAt?: string;
};

export interface AddressFormData {
  pincode: string;
  address: string;
  city: string;
  state: string;
  lat: string;
  lng: string;
}

export interface AddressFormProps {
  address?: Address;
  onSave: (data: AddressFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}
