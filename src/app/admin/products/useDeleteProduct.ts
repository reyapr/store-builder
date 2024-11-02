import { useState } from 'react'

import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'

export function useDeleteProduct(
  toast: CreateToastFnReturn,
  fetchProducts: () => void
) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [targetDeleteProductId, setTargetDeleteProductId] = useState(
    '' as string
  )

  const handleOpenDeleteModal = (id: string) => {
    setTargetDeleteProductId(id)
    onOpen()
  }

  const handleDeleteClose = () => {
    setTargetDeleteProductId('')
    onClose()
  }

  const handleDeleteProduct = (id: string) => async () => {
    try {
      await axios.delete(`/api/products/${id}`)
      fetchProducts()
      onClose()
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
    isOpen,
    onOpen: handleOpenDeleteModal,
    onClose: handleDeleteClose,
    handleDeleteProduct,
    targetDeleteProductId
  }
}
