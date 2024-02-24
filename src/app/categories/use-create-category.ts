import { ICreateCategoryRequest } from "@/interfaces/category";
import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";

export function useCreateCategory(toast: CreateToastFnReturn, fetchCategories: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCreateNewCategory = (request: ICreateCategoryRequest) => async () => {
    try {
      await axios.post('/api/categories', request);
      fetchCategories();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  }
  
  return {
    isOpen,
    onOpen,
    onClose,
    handleCreateNewCategory
  }
}