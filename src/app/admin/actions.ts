import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IOrder } from '@/interfaces';

const fetchOrders = async (dateStart: string, dateEnd: string) => {
  const response = await fetch(`/api/orders/total-order?dateStart=${dateStart}&dateEnd=${dateEnd}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export const useOrders = (dateStart: string, dateEnd: string): UseQueryResult<IOrder.IOrder[], Error> =>
  useQuery<IOrder.IOrder[], Error>({
    queryKey: ['orders', dateStart, dateEnd],
    queryFn: async () => await fetchOrders(dateStart, dateEnd)
  })