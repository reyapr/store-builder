'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Text,
  useToast
} from '@chakra-ui/react'

import { useGetCateogries } from '@/app/dashboard/categories/useGetCategory'
import { useGetProducts } from '@/app/dashboard/products/useGetProduct'
import { useCreateProduct } from '@/app/dashboard/products/useCreateProduct'
import { useDeleteProduct } from '@/app/dashboard/products/useDeleteProduct'
import { useUpdateProduct } from '@/app/dashboard/products/useUpdateProduct'
import { useGetStore } from '@/app/dashboard/stores/useGetStore'
import { DeleteAlert } from '@/components/DeleteAlert'
import CardProduct from '@/components/dashboard/CardProduct'
import Layout from '@/components/Layout'
import ProductFormModal from '@/components/ProductModal'
import { toIDRFormat } from '@/utils/idr-format'

export default function ProductPage() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const { stores, fetchStores } = useGetStore(toast)
  const { categories, fetchCategories } = useGetCateogries(toast)
  const { products, fetchProducts } = useGetProducts(toast)

  const createProductHook = useCreateProduct(toast, fetchProducts)
  const updateProductHook = useUpdateProduct(toast, fetchProducts)
  const deleteProductHook = useDeleteProduct(toast, fetchProducts)

  useEffect(() => {
    fetchProducts()
    fetchStores()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts({ query })
  }, [query])

  const sortProducts = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
  return (
    <Layout>
      <ProductFormModal
        title="Create new product"
        isOpen={createProductHook.isOpen}
        onClose={createProductHook.onClose}
        onSubmit={createProductHook.handleCreateProduct}
        stores={stores}
        categories={categories}
      />
      <ProductFormModal
        title="Update product"
        isOpen={updateProductHook.isOpen}
        onClose={updateProductHook.onClose}
        onSubmit={updateProductHook.handleUpdateProduct}
        stores={stores}
        categories={categories}
        data={updateProductHook.currentEditForm}
        editMode
      />
      <DeleteAlert
        isOpen={deleteProductHook.isOpen}
        onClose={deleteProductHook.onClose}
        onSubmit={deleteProductHook.handleDeleteProduct}
        title="Delete Porudct"
        id={deleteProductHook.targetDeleteProductId}
      />
      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <Flex flex="0.5">
          <Input
            placeholder="Cari produk"
            dropShadow="md"
            onChange={(e) => setQuery(e.target.value)}
          />
        </Flex>
        <Button colorScheme="blue" onClick={createProductHook.onOpen}>
          Tambah Produk
        </Button>
      </Flex>
      <Text fontSize="x-large" mb={4} fontWeight="bold">
        {products.length} produk ditemukan
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {products.sort(sortProducts).map((product) => (
          <GridItem>
            <CardProduct
              name={product.name}
              price={toIDRFormat(product.price)}
              stock={product.stock}
              store={product.store}
              categories={product.categories}
              imageUrl={product.imageUrl}
              description={product.description}
              onEdit={() => updateProductHook.onOpen(product)}
              onDelete={() => deleteProductHook.onOpen(product.id)}
            />
          </GridItem>
        ))}
      </Grid>
    </Layout>
  )
}
