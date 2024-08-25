import { useState } from 'react'

import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'

import {
  ISubmitStoreFormRequest,
  IUpdateStoreRequest
} from '@/interfaces/store'

export function useUpdateStore(
  toast: CreateToastFnReturn,
  fetchStores: () => void,
) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentEditForm, setCurrentEditForm] = useState({
    id: '',
    name: ''
  } as IUpdateStoreRequest)

  const submitUpdateStore = (request: ISubmitStoreFormRequest) => async () => {
    try {
      await axios.patch(`/api/stores/${request.id}`, request)
      fetchStores()
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
    handleEditClose()
  }

  const handleEdit = (request: IUpdateStoreRequest) => {
    setCurrentEditForm(request)

    onOpen()
  }

  const handleEditClose = () => {
    setCurrentEditForm({ id: '', name: '', userId: '' })
    onClose()
  }

  return {
    isOpen,
    onOpen,
    onClose,
    submitUpdateStore,
    handleEdit,
    handleEditClose,
    currentEditForm
  }
}
