import { CreateToastFnReturn } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useGetStore(toast: CreateToastFnReturn) {
  const [stores, setStores] = useState([] as any[]);
  
  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores');
      
      setStores(response.data.stores);
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
    stores,
    fetchStores
  }
}