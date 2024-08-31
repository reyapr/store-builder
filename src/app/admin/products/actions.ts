import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryResult
} from '@tanstack/react-query'

import { IProduct } from '@/interfaces'
import {
  IProductResponse,
  IEditProductRequest,
  ICreateProductRequest
} from '@/interfaces/product'

export const useGetProduct = (
  productId: String
): UseQueryResult<IProductResponse, Error> =>
  useQuery<IProductResponse, Error>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    }
  })

export const useGetProducts = (
  params?: IFetchProductRequest
): UseQueryResult<IProductResponse[], Error> =>
  useQuery<IProductResponse[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const response = await fetch(`/api/products?${queryString}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return data.products
    }
  })

export const useDeleteProducts = (id: string) =>
  useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: async () => {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    }
  })

export const useCreateProducts = (product: ICreateProductRequest) =>
  useMutation({
    mutationKey: ['products', 'create'],
    mutationFn: async () => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return data.products
    }
  })

export const useUpdateProducts = (
  options?: Omit<
    UseMutationOptions<IProduct.IProduct, Error, IProduct.IEditProductRequest>,
    'mutationFn'
  >
) =>
  useMutation<Awaited<IProduct.IProduct>, Error, IProduct.IEditProductRequest>({
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

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: form
      })
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
    ...options
  })

export interface IFetchProductRequest {
  categoryIds?: string[]
  q?: string
}
