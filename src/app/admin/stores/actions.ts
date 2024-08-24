/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import { CreateToastFnReturn } from '@chakra-ui/react'
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

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

export const updateStores = () =>
  useMutation<
    Awaited<IStore.IStore>,
    Error,
    IStore.IUpdateStoreRequest
  >({
    mutationKey: ['api', 'stores', 'edit'],
    mutationFn: async (request: IStore.IUpdateStoreRequest) => {
      const { data } = await axios.patch(
        `/api/stores/${request.id}`,
        request
      )
      return data.category
    }
  })

  export const getStore = (storeId: string): UseQueryResult<IStore.IStore, Error> =>
   {
    return useQuery<IStore.IStore, Error>({
      queryKey: ['store', storeId],
      queryFn: async () => {
        const { data } = await axios.get(`/api/stores/${storeId}`)
        return data.store
      },
      enabled: !!storeId // Only run the query if storeId is provided
    })
   }