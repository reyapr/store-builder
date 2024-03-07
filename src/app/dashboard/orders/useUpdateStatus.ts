import { IUpdateOrderStatusRequest } from "@/interfaces/order";
import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";


export function useUpdateOrderStatus(toast: CreateToastFnReturn ,fetchOrders: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultValue = {
    id: '',
    status: ''
  }
  
  const [request, setRequest] = useState<IUpdateOrderStatusRequest>(defaultValue);
  
  const clearRequestOnClose = () => {
    setRequest(defaultValue);
    onClose();
  }
  
  const setRequestOnOpen = (request: IUpdateOrderStatusRequest) => {
    setRequest(request);
    onOpen();
  }
  
  const onSubmit = async (request: IUpdateOrderStatusRequest) => {
    try {
      await axios.patch(`/api/order/${request.id}`, request);
      fetchOrders();
      clearRequestOnClose();
    } catch (error) {
      toast({
        title: "Failed to update order status",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  
  return {
    isOpen,
    onOpen: setRequestOnOpen,
    onClose: clearRequestOnClose,
    request,
    onSubmit
  }
}