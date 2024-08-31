'use client'

import React from 'react'

import { useToast } from '@chakra-ui/react'

import { useUpdateProducts } from '@/app/admin/products/actions'
import { Layout, ProductForm } from '@/components'
import { IStore } from '@/interfaces'

export default function Edit() {
  const toast = useToast()
  const { mutate, isPending } = useUpdateProducts({
    onSuccess() {
      toast({
        title: 'Berhasil',
        description: 'produk berhasil diupdate',
        status: 'success',
        isClosable: true
      })
    },
    onError() {
      toast({
        title: 'Gagal',
        description: 'produk gagal diupdate',
        status: 'error',
        isClosable: true
      })
    }
  })

  const breadcrumbs = [
    { label: 'dashboard', path: '/admin' },
    { label: 'produk', path: '/admin/products' },
    { label: 'edit - ', path: '/admin/product' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <ProductForm
        isPending={isPending}
        onSubmit={mutate}
        product={{
          id: '',
          storeId: '',
          createdAt: '',
          updatedAt: '',
          name: '',
          description: '',
          imageUrl: '',
          price: 0,
          stock: 0,
          store: {} as IStore.IStore,
          categories: []
        }}
        title="Tambah Produk"
      />
    </Layout>
  )
}
