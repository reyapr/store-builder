/* eslint-disable react-hooks/rules-of-hooks */
import {
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import axios from 'axios'

import { IOrder, IOrderRequest } from '@/interfaces/order'

export const useCreateOrders = (options?: Omit<
  UseMutationOptions<IOrder, Error, IOrderRequest>,
  'mutationFn'
>) =>
  useMutation<IOrder, Error, IOrderRequest>({
    mutationKey: ['orders', 'create'],
    mutationFn: async (product: IOrderRequest) => {
      const { data } = await axios.post(`/api/orders`, product)
      return data.products
    },
    ...options 
  })