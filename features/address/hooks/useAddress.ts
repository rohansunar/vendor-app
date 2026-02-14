import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/address.service';

export function useAddresses() {
  return useQuery({
    queryKey: ['address'], // Changed to singular
    queryFn: addressService.getAddresses,
  });
}
