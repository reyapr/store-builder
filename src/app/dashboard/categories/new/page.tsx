'use client'

import React, { useState } from 'react'

import { Button, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createCategories } from '@/app/dashboard/categories/actions'
import { getStores } from '@/app/dashboard/stores/actions'
import { Layout } from '@/components'
import Form from '@/components/dashboard/categories/Form'
import { ICreateCategoryRequest } from '@/interfaces/category'

export default function Create() {
  const toast = useToast()
  const router = useRouter()
  const {
    data: stores,
    isFetching: isFetchingStores,
    error: errorStores
  } = getStores()
  const { isPending, mutate } = createCategories()

  const [input, setInput] = useState<ICreateCategoryRequest>({
    name: '',
    storeId: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kategori', path: '/dashboard/categories' }
  ]

  const onSubmit = (input: ICreateCategoryRequest): void => {
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

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetchingStores}
      error={errorStores as Error}
      rightHeaderComponent={
        <Link href="/dashboard/categories/new">
          <Button colorScheme="blue" size="sm" onClick={() => {}}>
            Create Category
          </Button>
        </Link>
      }
    >
      {!!stores?.length && (
        <Form
          onChange={handleChange}
          category={input}
          isLoading={isPending}
          stores={stores}
          onSubmit={() => onSubmit(input)}
        />
      )}
    </Layout>
  )
}
