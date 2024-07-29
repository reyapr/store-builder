import { useState } from 'react'
import axios from 'axios'
import { CreateToastFnReturn } from '@chakra-ui/react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { ICategory } from '@/interfaces'

export const getCategories = (
  params?: IFetchCategoriesRequest
): UseQueryResult<ICategory.ICategory[], Error> =>
  useQuery<ICategory.ICategory[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories', { params })
      return data.categories
    }
  })

export interface IFetchCategoriesRequest {
  storeName?: string
}