/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'

import { FormLabel, Grid, Stack, useToast } from '@chakra-ui/react'
import { Select as MultiSelect } from 'chakra-react-select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { getCategories } from '@/app/dashboard/categories/actions'
// import { Layout } from '@/app/s/[storeName]/components/Layout'
import { useProductList } from '@/app/s/[storeName]/use-product-list'
import { useStore } from '@/app/s/[storeName]/useStore'
import { ProductCard } from '@/components'
import { Layout } from '@/components/homepage'
import { IProduct } from '@/interfaces'
import { cartStore } from '@/stores/useCart'
import { createQueryString } from '@/utils/url-params'

import { getProducts } from '@/app/dashboard/products/actions'

export default function Stores({ params }: { params: { storeName: string } }) {
  const toast = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const cart = useStore(cartStore, (state) => state, params.storeName)
  const categoryIds = searchParams.get('categories')?.split(',')
  const [categoryOptions, setCategoryOptions] = useState<
    IProduct.ICategoryInput[]
  >([])
  const [query, setQuery] = useState('')
  const { data: products, isFetching, error } = getProducts({ query })

  const storeName = decodeURI(params.storeName)

  const { validateCurrentPage } = useProductList(toast, router, storeName)

  const { data: categories } = getCategories({
    ...params,
    storeName
  })

  useEffect(() => {
    if (categories?.length) {
      const options: IProduct.ICategoryInput[] = categories
        .filter((category) => category.store?.name === storeName)
        .map((category) => ({ label: category.name, value: category.id }))
      setCategoryOptions(options)
    }
  }, [categories])

  const initInputCategories = categoryIds
    ? categoryOptions.filter((category) =>
        categoryIds?.includes(category.value)
      )
    : []

  const [inputCategories, setInputCategories] =
    useState<IProduct.ICategoryInput[]>(initInputCategories)

  useEffect(() => {
    validateCurrentPage()
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
    // const categoryIds = searchParams.get('categories')?.split(',')
    // const searchQuery = searchParams.get('search') || undefined
  }, [searchParams.get('categories'), searchParams.get('search')])

  return (
    <Layout storeName={storeName}>
      <Stack gap={6}>
        <FormLabel>Filter berdasarkan kategori</FormLabel>
        <MultiSelect
          isMulti
          size="sm"
          placeholder="Pilih kategori"
          onChange={(value) =>
            setInputCategories(value as IProduct.ICategoryInput[])
          }
          value={inputCategories}
          options={categoryOptions}
        />
        {!!products?.length && !isFetching && (
          <Grid gap={4} templateColumns="repeat(4, 1fr)">
            {products.map((product: IProduct.IProductResponse) => (
              <ProductCard
                key={product.id}
                product={IProduct.IProduct.fromData(product)}
                addToCart={cart.addProduct}
              />
            ))}
          </Grid>
        )}
      </Stack>
    </Layout>
  )
}
