// Product list
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });
}
