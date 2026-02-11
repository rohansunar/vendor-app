// Product list
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}
