import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profile.service';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });
}
