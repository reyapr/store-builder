import axios from 'axios'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { IOrder } from '@/interfaces'

export const getOrders = (): UseQueryResult<IOrder.IOrder[], Error> =>
  useQuery<IOrder.IOrder[], Error>({
    queryKey: ['order'],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders')
      return data
    }
  })

