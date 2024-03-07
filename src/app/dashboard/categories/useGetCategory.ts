import { ICategory } from "@/interfaces/category";
import { CreateToastFnReturn } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useGetCateogries(toast: CreateToastFnReturn, storeName?: string){
  const [categories, setCategories] = useState<ICategory[]>([] as ICategory[]);
  
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories', { params: { storeName } });
      setCategories(data.categories);
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
    categories,
    fetchCategories
  }
}