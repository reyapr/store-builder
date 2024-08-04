/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

import { IProduct } from '@/interfaces'
import {
  IProductResponse,
  IEditProductRequest,
  ICreateProductRequest
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

export const deleteProducts = (id: string) =>
  useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: async () => {
      return await axios.delete(`/api/products/${id}`)
    }
  })

export const createProducts = (product: ICreateProductRequest) =>
  useMutation({
    mutationKey: ['products', 'create'],
    mutationFn: async () => {
      const { data } = await axios.post(`/api/products`, product)
      return data.products
    }
  })

export const updateProducts = () =>
  useMutation<Awaited<IProduct.IProduct>, Error, IProduct.IEditProductRequest>(
    {
      mutationKey: ['products', 'update'],
      mutationFn: async (product: IEditProductRequest) => {
        const form = new FormData()
        form.append('name', product.name)
        form.append('price', product.price.toString())
        form.append('stock', product.stock.toString())
        form.append('storeId', product.storeId)
        form.append('categoryIds', JSON.stringify(product.categoryIds))
        form.append('description', product.description)
        if (product?.image) {
          form.append('image', product.image)
        }

        const { data } = await axios.patch(`/api/products/${product.id}`, form)
        return data
      }
    }
  )

export interface IFetchProductRequest {
  categoryIds?: string[]
  query?: string
}
