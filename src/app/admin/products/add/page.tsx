'use client'

import React from 'react'

import { useToast } from '@chakra-ui/react'

import { getProduct, updateProducts } from '@/app/admin/products/actions'
import { Layout, ProductForm } from '@/components'

export default function Edit({ params }: Props) {
  const toast = useToast()
  const { mutate, isPending } = updateProducts({
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
        title="Tambah Produk"
      />
    </Layout>
  )
}

type Props = { params: { productId: string } }
