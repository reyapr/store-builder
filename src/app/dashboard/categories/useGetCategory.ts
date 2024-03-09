import { CreateToastFnReturn } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useGetCateogries(toast: CreateToastFnReturn){
  const [categories, setCategories] = useState([] as any[]);
  
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
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