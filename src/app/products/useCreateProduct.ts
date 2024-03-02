import { ICreateProductRequest } from "@/interfaces/product";
import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";

export function useCreateProduct(toast: CreateToastFnReturn, fetchProducts: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleCreateProduct = (request: ICreateProductRequest) => async () => {
    try {
      const response = await axios.post('/api/products', request);
      fetchProducts();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  }
  
  return {
    isOpen,
    onOpen,
    onClose,
    handleCreateProduct
  }
}