import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/address.service';

export function useAddresses() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['address'], // Changed to singular
    queryFn: addressService.getAddresses,
    enabled: isAuthenticated,
  });
}
