import { IOrders } from "@/interfaces/order";
import { CreateToastFnReturn } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";


export const useGetOrder = (toast: CreateToastFnReturn) => {
  
  const [orders, setOrders] = useState([] as IOrders[]);
  
  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order');
      setOrders(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true
      
      })
    }
  }
  
  return { orders, fetchOrders };
}