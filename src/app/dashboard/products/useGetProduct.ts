import { IProduct } from "@/interfaces/product";
import { CreateToastFnReturn } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function useGetProducts(toast: CreateToastFnReturn, storeName?: string, isStockAvailable?: boolean) {
  const [products, setProducts] = useState([] as IProduct[]);
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products', { params: { storeName, isStockAvailable } });
      setProducts(data.products);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  };

  return { products, fetchProducts };
}