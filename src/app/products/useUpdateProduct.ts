import { ICreateProductRequest, IEditProductRequest, IProduct } from "@/interfaces/product";
import { CreateToastFnReturn, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useUpdateProduct(toast: CreateToastFnReturn, fetchProducts: () => void){
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initForm = {
    id: '',
    name: '',
    price: '',
    quantity: 0,
    storeId: '',
    categories: [],
  } as IEditProductRequest
  
  const [currentEditForm, setCurrentEditForm] = useState(initForm);
  
  const handleUpdateProduct = (request: ICreateProductRequest) => async () => {
    try {
      await axios.patch(`/api/products/${currentEditForm.id}`, request);
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
  
  const handleEdit = (product: IProduct) => {
    const request: IEditProductRequest = {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price.toString(),
      storeId: product.store.id,
      categories: product.categories.map((category) => ({
        label: category.name,
        value: category.id
      }))
    }
    console.log(request, '<=================== request ==================');
    setCurrentEditForm(request);
    onOpen();
  }
  
  const handleEditClose = () => {
    setCurrentEditForm(initForm)
    onClose();
  }
  
  return {
    isOpen,
    onOpen: handleEdit,
    onClose: handleEditClose,
    handleUpdateProduct,
    currentEditForm
  }
}