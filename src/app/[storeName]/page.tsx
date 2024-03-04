"use client"
import { Layout } from "@/app/[storeName]/components/Layout";
import { useProductList } from "@/app/[storeName]/use-product-list";
import { useGetProducts } from "@/app/products/useGetProduct";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/stores/useCart";
import { Grid, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreProductList({ params }: { params: { storeName: string } }) {
  const toast = useToast();
  const router = useRouter();
  const cart = useCartStore()
  
  const { validateCurrentPage } = useProductList(toast, router, params.storeName);
  const { products, fetchProducts }  = useGetProducts(toast, params.storeName);
  
  useEffect(() => {
    validateCurrentPage();
    fetchProducts();
  }, []);
  
  console.log(cart.products)
  
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