import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { cityService } from '../services/city.service';

export function useCities() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['cities'],
    queryFn: cityService.getCities,
    enabled: isAuthenticated,
  });
}
