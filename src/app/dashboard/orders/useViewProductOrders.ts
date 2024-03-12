import { IProductOrder } from '@/interfaces/order'
import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'

export function useViewProductOrders() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [productOrders, setProductOrders] = useState<IProductOrder[]>([])

  const clearProductOrdersOnClose = () => {
    setProductOrders([])
    onClose()
  }

  const setProductOrdersOnOpen = (productOrders: IProductOrder[]) => {
    setProductOrders(productOrders)
    onOpen()
  }

  return {
    isOpen,
    onOpen: setProductOrdersOnOpen,
    onClose: clearProductOrdersOnClose,
    productOrders
  }
}
