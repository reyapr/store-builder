import { IProduct } from '@/interfaces/product'
import { CreateToastFnReturn } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'

export interface IFetchProductRequest {
  categoryIds?: string[]
  query?: string
}

export function useGetProducts(
  toast: CreateToastFnReturn,
  storeName?: string,
  isStockAvailable?: boolean
) {
  const [products, setProducts] = useState([] as IProduct[])
  const fetchProducts = async (req?: IFetchProductRequest) => {
    try {
      const { data } = await axios.get('/api/products', {
        params: {
          storeName,
          isStockAvailable,
          categories: req?.categoryIds?.join(','),
          q: req?.query
        }
      })
      setProducts(data.products)
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
  }

  return { products, fetchProducts }
}
