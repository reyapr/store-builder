'use client'
import React from 'react'
import { Layout } from '@/app/s/[storeName]/components/Layout'
import { useProductList } from '@/app/s/[storeName]/use-product-list'
import { useStore } from '@/app/s/[storeName]/useStore'
import { ProductCard } from '@/components'
import { cartStore } from '@/stores/useCart'
import { Box, FormControl, FormLabel, Grid, useToast } from '@chakra-ui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetCateogries } from '@/app/dashboard/categories/actions'
import { Select as MultiSelect } from 'chakra-react-select'
import { ICategory, IProduct } from '@/interfaces'
import { createQueryString } from '@/utils/url-params'

export default function Stores({ params }: { params: { storeName: string } }) {
  const toast = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const cart = useStore(cartStore, (state) => state, params.storeName)
  const categoryIds = searchParams.get('categories')?.split(',')
  const searchInput = searchParams.get('search') || ''

  const { validateCurrentPage } = useProductList(
    toast,
    router,
    params.storeName
  )

  const { categories, fetchCategories } = useGetCateogries(
    toast,
    params.storeName
  )
  const categoryOptions = categories
    .filter(
      (category: ICategory.ICategory) =>
        category.store?.name === params.storeName
    )
    .map((category) => ({ label: category.name, value: category.id }))

  const initInputCategories = categoryIds
    ? categoryOptions.filter((category) =>
        categoryIds?.includes(category.value)
      )
    : []

  const [inputCategories, setInputCategories] =
    useState<IProduct.ICategoryInput[]>(initInputCategories)

  useEffect(() => {
    validateCurrentPage()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (initInputCategories.length > 0) {
      setInputCategories(initInputCategories)
    }
  }, [initInputCategories.length])

  useEffect(() => {
    const categoryIds = inputCategories.map((category) => category.value)
    const query = createQueryString(searchParams, {
      key: 'categories',
      value: categoryIds.join(',')
    })

    router.push(`${pathname}${query}`)
  }, [inputCategories.length])

  useEffect(() => {
    const categoryIds = searchParams.get('categories')?.split(',')
    const searchQuery = searchParams.get('search') || undefined
  }, [searchParams.get('categories'), searchParams.get('search')])

  return (
    <Layout storeName={params.storeName} home>
      <Box m={3}>
        <FormControl>
          <FormLabel>Filter By Categories</FormLabel>
          <MultiSelect
            isMulti
            placeholder="Select Categories"
            onChange={(value) =>
              setInputCategories(value as IProduct.ICategoryInput[])
            }
            value={inputCategories}
            options={categoryOptions}
          />
        </FormControl>
      </Box>
      <Grid gap={4} templateColumns="repeat(4, 1fr)">
        {[].map((product: IProduct.IProduct) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={cart.addProduct}
          />
        ))}
      </Grid>
    </Layout>
  )
}
