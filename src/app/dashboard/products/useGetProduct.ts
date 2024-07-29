import axios from 'axios'
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query'
import {
  ICreateProductRequest,
  IProduct,
  IProductResponse,
  IProductsResponse,
} from '@/interfaces/product'

export const getProduct = (
  productId: String
): UseQueryResult<IProductResponse, Error> =>
  useQuery<IProductResponse, Error>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${productId}`)
      return data
    }
  })

export const getProducts = (
  params?: IFetchProductRequest
): UseQueryResult<IProductResponse[], Error> =>
  useQuery<IProductResponse[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/products', { params })
      return data.products
    }
  })

export const deleteProducts = (id?: string) =>
  useMutation({
    mutationKey: ['delete', 'products'],
    mutationFn: async () => {
      return await axios.delete(`/api/products/${id}`)
    }
  })

export const createProducts = (product?: ICreateProductRequest) =>
  useMutation({
    mutationKey: ['delete', 'products'],
    mutationFn: async () => {
      const { data } = await axios.post(`/api/products`, product)
      return data.products
    }
  })

export interface IFetchProductRequest {
  categoryIds?: string[]
  query?: string
}
