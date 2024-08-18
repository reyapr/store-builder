/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,

  UseQueryResult
} from '@tanstack/react-query'
import axios from 'axios'

import { IOrder } from '@/interfaces'


export const useGetOrderDetail = (orderId?: string): UseQueryResult<IOrder.IProductOrderResponse, Error> =>
  useQuery<IOrder.IProductOrderResponse, Error>({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders/'+orderId,)
      return data
    },
    enabled: !!orderId
  })


