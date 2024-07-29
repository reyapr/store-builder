import { useState } from 'react'
import axios from 'axios'
import { CreateToastFnReturn } from '@chakra-ui/react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { IStore } from '@/interfaces'

export const getStores = (): UseQueryResult<IStore.IStore[], Error> =>
  useQuery<IStore.IStore[], Error>({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stores')
      return data.stores
    }
  })

export function useGetStore(toast: CreateToastFnReturn) {
  const [stores, setStores] = useState([] as any[])

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores')

      setStores(response.data.stores)
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
    stores,
    fetchStores
  }
}
