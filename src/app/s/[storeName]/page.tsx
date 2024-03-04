"use client"
import { Layout } from "@/app/s/[storeName]/components/Layout";
import { useProductList } from "@/app/s/[storeName]/use-product-list";
import { useStore } from "@/app/s/[storeName]/useStore";
import { useGetProducts } from "@/app/products/useGetProduct";
import { ProductCard } from "@/components/ProductCard";
import { cartStore } from "@/stores/useCart";
import { Grid, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreProductList({ params }: { params: { storeName: string } }) {
  const toast = useToast();
  const router = useRouter();
  const cart = useStore(cartStore, (state) => state, params.storeName)
  
  const { validateCurrentPage } = useProductList(toast, router, params.storeName);
  const { products, fetchProducts }  = useGetProducts(toast, params.storeName, true);
  
  useEffect(() => {
    validateCurrentPage();
    fetchProducts();
  }, []);
  
  
  return (
    <Layout storeName={params.storeName}>
      <Grid gap={4} templateColumns='repeat(4, 1fr)'>
        {
          products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={cart.addProduct}/>
          ))
        }
      </Grid>
    </Layout>
  )
}