/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

import { IOrder } from '@/interfaces'

export const getOrders = (): UseQueryResult<IOrder.IOrder[], Error> =>
  useQuery<IOrder.IOrder[], Error>({
    queryKey: ['order'],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders')
      return data
    }
  })

