import React from 'react'
import { Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'

const MENU = [
  {
    id: 2,
    name: 'Toko',
    path: '/dashboard/stores'
  },
  {
    id: 3,
    name: 'Produk',
    path: '/dashboard/products'
  },
  {
    id: 4,
    name: 'Order',
    path: '/dashboard/orders'
  },
  {
    id: 5,
    name: 'Kategori',
    path: '/dashboard/categories'
  }
]

export default function Sidebar() {
  return (
    <Flex
      flexDirection="column"
      width="180px"
      boxShadow="0 0 15px rgb(0 0 0 / 0.15)"
    >
      {MENU.map((item) => (
        <Button key={item.id} variant="ghost">
          <Link href={item.path}>{item.name}</Link>
        </Button>
      ))}
    </Flex>
  )
}
