export function getPaymentColor(status: string) {
  switch (status) {
    case 'PENDING':
      return '#F59E0B';
    case 'PAID':
      return '#16A34A';
    default:
      return '#64748B';
  }
}

export function getDeliveryColor(status: string) {
  switch (status) {
    case 'PENDING':
      return '#F59E0B';
    case 'OUT_FOR_DELIVERY':
      return '#2563EB';
    case 'DELIVERED':
      return '#16A34A';
    case 'CANCELLED':
      return '#DC2626';
    default:
      return '#64748B';
  }
}
