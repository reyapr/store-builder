"use client"
import { Layout } from "@/app/s/[storeName]/components/Layout";
import { useProductList } from "@/app/s/[storeName]/use-product-list";
import { useStore } from "@/app/s/[storeName]/useStore";
import { useGetProducts } from "@/app/dashboard/products/useGetProduct";
import { ProductCard } from "@/components/ProductCard";
import { cartStore } from "@/stores/useCart";
import { FormLabel, Grid, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetCateogries } from "@/app/dashboard/categories/useGetCategory";
import { Select as MultiSelect, MultiValue } from "chakra-react-select"
import input from "postcss/lib/input";
import { ICategory } from "@/interfaces/category";
import { ICategoryInput } from "@/interfaces/product";

export default function StoreProductList({ params }: { params: { storeName: string } }) {
  const toast = useToast();
  const router = useRouter();
  const cart = useStore(cartStore, (state) => state, params.storeName)
  
  const { validateCurrentPage } = useProductList(toast, router, params.storeName);
  const { products, fetchProducts }  = useGetProducts(toast, params.storeName, true);
  const { categories, fetchCategories } = useGetCateogries(toast, params.storeName);
  
  const [inputCategories, setInputCategories] = useState<ICategoryInput[]>([] as ICategoryInput[]);
  const categoryOptions = categories
    .filter((category: ICategory) => category.store?.name === params.storeName)
    .map(category => ({ label: category.name, value: category.id }))
  
  useEffect(() => {
    validateCurrentPage();
    fetchProducts();
    fetchCategories();
  }, []);
  
  useEffect(() => {
    fetchProducts(inputCategories.map(category => category.value));
  }, [inputCategories.length]);
  
  
  return (
    <Layout storeName={params.storeName}>
      <FormLabel>Filter By Categories</FormLabel>
      <MultiSelect
        isMulti
        placeholder='Select Categories'
        onChange={(value) => setInputCategories(value as ICategoryInput[])}
        value={inputCategories}
        options={categoryOptions}
      />
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