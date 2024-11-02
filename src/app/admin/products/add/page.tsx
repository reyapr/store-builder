'use client'

import React from 'react'

import { useToast } from '@chakra-ui/react'

import { useCreateProducts } from '@/app/admin/products/actions'
import { Layout, ProductForm } from '@/components'
import { IStore } from '@/interfaces'

export default function Edit() {
  const toast = useToast()
  const { mutate, isPending } = useCreateProducts({
    onSuccess() {
      toast({
        title: 'Berhasil',
        description: 'produk berhasil dibuat',
        status: 'success',
        isClosable: true
      })
    },
    onError(error) {
      toast({
        title: 'Gagal',
        description: `produk gagal dibuat\n ${error.message}`,
        status: 'error',
        isClosable: true
      })
    }
  })

  const breadcrumbs = [
    { label: 'dashboard', path: '/admin' },
    { label: 'produk', path: '/admin/products' },
    { label: 'Tambah', path: '/admin/product' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <ProductForm
        isPending={isPending}
        onCreate={mutate}
        product={{
          id: '',
          storeId: '',
          createdAt: '',
          updatedAt: '',
          name: '',
          description: '',
          imageUrl: '',
          price: 0,
          priceBase: 0,
          stock: 0,
          store: {} as IStore.IStore,
          categories: []
        }}
        title="Tambah Produk"
      />
    </Layout>
  )
}
