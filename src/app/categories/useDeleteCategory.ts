import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useDeleteCategory(toast: CreateToastFnReturn, fetchCategories: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [targetDeleteCategoryId, setTargetDeleteCateogryId] = useState('' as string);
  
  const handleOpenDeleteModal = (id: string) => {
    setTargetDeleteCateogryId(id);
    onOpen();
  }
  
  const handleDeleteClose = () => {
    setTargetDeleteCateogryId('');
    onClose();
  }
  
  
  const handleDeleteCategory = (id: string) => async () => {
    try {
      await axios.delete(`/api/categories/${id}`);
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
    onOpen: handleOpenDeleteModal,
    onClose: handleDeleteClose,
    handleDeleteCategory,
    targetDeleteCategoryId
  }
}