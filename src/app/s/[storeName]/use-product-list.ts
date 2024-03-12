import { IStore } from '@/interfaces/store'
import { CreateToastFnReturn } from '@chakra-ui/react'
import axios from 'axios'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const filterStorePath = async (storeName: string) => {
  const response = await axios.get('/api/stores')
  const stores = response.data.stores as IStore[]
  const storeNames = stores.map((store) => store.name)
  const isRegistered = storeNames.includes(storeName)

  return isRegistered
}

export const useProductList = (
  toast: CreateToastFnReturn,
  router: AppRouterInstance,
  storeName: string
) => {
  const validateCurrentPage = async () => {
    try {
      const isRegistered = await filterStorePath(storeName)
      if (!isRegistered) {
        router.push('/error')
      }
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

  return {
    validateCurrentPage
  }
}
