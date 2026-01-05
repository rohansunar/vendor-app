export type Address = {
  id: string;
  service_radius_m: number;
  delivery_time_msg?: string;
  street: string;
  cityId: string;
  city: string;
  state: string;
  zipCode: string;
  location?: {
    lat: number;
    lng: number;
  };
  address: string;
  createdAt: string;
};

export interface AddressFormProps {
  address?: Address;
  onSave: (data: {
    service_radius_m: number;
    delivery_time_msg?: string;
    street: string;
    cityId: string;
    state: string;
    zipCode: string;
    location: {
      lat: number;
      lng: number;
    };
    address: string;
  }) => void;
  onCancel: () => void;
  isPending: boolean;
}
