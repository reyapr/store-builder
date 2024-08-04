'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import {
  getCategory,
  updateCategories
} from '@/app/dashboard/categories/actions'
import { getStores } from '@/app/dashboard/stores/actions'
import { Layout } from '@/components'
import Form from '@/components/dashboard/categories/Form'
import { IUpdateCategoryRequest } from '@/interfaces/category'

export default function Edit({ params }: Props) {
  const toast = useToast()
  const router = useRouter()

  const [input, setInput] = useState<IUpdateCategoryRequest>({
    id: params.categoryId,
    name: '',
    storeId: ''
  })

  const { mutate } = updateCategories()

  const {
    data: category,
    isFetching: isFetchingCategory,
    error: errorCategory
  } = getCategory(params.categoryId)

  useEffect(() => {
    if (category) {
      setInput((prev) => ({
        ...prev,
        name: category?.name,
        storeId: category.storeId
      }))
    }
  }, [category])

  const {
    data: stores,
    isFetching: isFetchingStores,
    error: errorStores
  } = getStores()

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (input: IUpdateCategoryRequest): void => {
    mutate(input, {
      onSuccess() {
        toast({
          title: 'Berhasil memperbaharui kategori',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        router.push('/dashboard/categories')
      },
      onError(error) {
        console.log(error)
        toast({
          title: 'Gagal memperbaharui kategori',
          description: (error as Error).message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    })
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kategori', path: '/dashboard/categories' },
    { label: 'Edit', path: `/dashboard/categories/${params.categoryId}/edit` }
  ]

  console.log({ input })
  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetchingStores || isFetchingCategory}
      error={(errorStores || errorCategory) as Error}
    >
      {!!stores?.length && !!category && (
        <Form
          onChange={onChange}
          category={input}
          stores={stores}
          onSubmit={() => onSubmit(input)}
        />
      )}
    </Layout>
  )
}

type Props = { params: { categoryId: string } }
