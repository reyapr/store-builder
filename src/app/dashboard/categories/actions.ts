import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

import { ICategory } from '@/interfaces'


export const getCategory = (
  categoryId: string
): UseQueryResult<ICategory.ICategory, Error> =>
  useQuery<ICategory.ICategory, Error>({
    queryKey: ['categories', categoryId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/categories/${categoryId}`)
      return data
    }
  })

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

export const createCategories = () =>
  useMutation<
    Awaited<ICategory.ICategory>,
    Error,
    ICategory.ICreateCategoryRequest
  >({
    mutationKey: ['categories', 'create'],
    mutationFn: async (request: ICategory.ICreateCategoryRequest) => {
      const { data } = await axios.post('/api/categories', request)
      return data.category
    }
  })

export const updateCategories = () =>
  useMutation<
    Awaited<ICategory.ICategory>,
    Error,
    ICategory.IUpdateCategoryRequest
  >({
    mutationKey: ['categories', 'update'],
    mutationFn: async (request: ICategory.IUpdateCategoryRequest) => {
      const { data } = await axios.patch(
        `/api/categories/${request.id}`,
        request
      )
      return data.category
    }
  })

export interface IFetchCategoriesRequest {
  storeName?: string
}
