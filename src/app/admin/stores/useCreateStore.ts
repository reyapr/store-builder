import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'

import {
  ISubmitStoreFormRequest,
  ICreateStoreRequest
} from '@/interfaces/store'

export function useCreateStore(
  toast: CreateToastFnReturn,
  fetchStores: () => void,
  supabase: SupabaseClient
) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const submitNewStore = (request: ISubmitStoreFormRequest) => async () => {
    const { data } = await supabase.auth.getSession()
    const user = data?.session?.user
    const storRequest = {
      name: request.name,
      email: user?.email
    } as ICreateStoreRequest

    try {
      await axios.post('/api/stores', storRequest)
      await fetchStores()
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
    onClose()
  }

  return {
    isOpen,
    onOpen,
    onClose,
    submitNewStore
  }
}
