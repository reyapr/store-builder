import { IUpdateCategoryRequest, ICreateCategoryRequest } from "@/interfaces/category";
import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useUpdateCategory(toast: CreateToastFnReturn, fetchCategories: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultCategoryInput = { id: '', name: '', storeId: ''} as IUpdateCategoryRequest;
  
  const [currentEditForm, setCurrentEditForm] = useState(defaultCategoryInput);
  
  const handleSubmit = (request: ICreateCategoryRequest) => async () => {
    try {
      await axios.patch(`/api/categories/${currentEditForm.id}`, request);
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
  
  const handleEdit = (request: IUpdateCategoryRequest) => {
    setCurrentEditForm(request);
    onOpen();
  }
  
  const handleCloseModal = () => {
    setCurrentEditForm(defaultCategoryInput)
    onClose();
  }
  
  return {
    isOpen,
    onOpen: handleEdit,
    onClose: handleCloseModal,
    handleSubmit,
    currentEditForm
  }
}