import { CreateToastFnReturn, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'

import { ICreateProductRequest } from '@/interfaces/product'

export function useCreateProduct(
  toast: CreateToastFnReturn,
  fetchProducts: () => void
) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleCreateProduct = (request: ICreateProductRequest) => async () => {
    try {
      const form = new FormData()
      form.append('name', request.name)
      form.append('price', request.price.toString())
      if(request.stock){
        form.append('stock', request.stock.toString())
      }
      form.append('storeId', request.storeId)
      form.append('categoryIds', JSON.stringify(request.categoryIds))
      form.append('description', request.description)
      if(request.image){
        form.append('image', request.image)
      }

      await axios.post('/api/products', form)
      fetchProducts()
      onClose()
    } catch (error) {
      let description
      if (
        (error as any).response.data.error.includes('resource already exist')
      ) {
        description = 'Image name is already exist. Please use another image.'
      } else {
        description = (error as Error).message
      }
      toast({
        title: 'Error',
        description,
        status: 'error',
        duration: 2500,
        isClosable: true
      })
    }
  }

  return {
    isOpen,
    onOpen,
    onClose,
    handleCreateProduct
  }
}
