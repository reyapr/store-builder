'use client'
import React from 'react'

import {
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Tag,
  useToast,
  VStack
} from '@chakra-ui/react'

import { getOrders } from '@/app/admin/orders/actions'
import { useViewProductOrders } from '@/app/admin/orders/useViewProductOrders'
import Layout from '@/components/Layout'
import { EOrderStatus, mapOrderStatusToColor } from '@/constants/order'
import { IProductOrder } from '@/interfaces/order'
import { currency, sort } from '@/utils'

import ListOfProductModal from './components/ListOfProductModal'
import UpdateStatusModal from './components/UpdateStatusModal'
import { useUpdateOrderStatus } from './useUpdateStatus'

export default function Home() {
  const toast = useToast()
  const { data: orders, isFetching, error, refetch } = getOrders()
  const viewProductOrdersHook = useViewProductOrders()
  const updateOrderStatusHook = useUpdateOrderStatus(toast, refetch)

  const getTotalQuantity = (items: IProductOrder[]) => {
    return items.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  }

  const getTotalPrice = (items: IProductOrder[]) => {
    return currency.toIDRFormat(
      items.reduce((acc, item) => {
        return acc + item.quantity * item.product.price
      }, 0)
    )
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Order', path: '/admin/orders' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
    >
      <ListOfProductModal
        isOpen={viewProductOrdersHook.isOpen}
        onClose={viewProductOrdersHook.onClose}
        productOrders={viewProductOrdersHook.productOrders}
      />
      <UpdateStatusModal
        isOpen={updateOrderStatusHook.isOpen}
        onClose={updateOrderStatusHook.onClose}
        statuses={Object.values(EOrderStatus)}
        orderRequest={updateOrderStatusHook.request}
        onSubmit={updateOrderStatusHook.onSubmit}
      />
      <Table variant={'simple'}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Store Name</Th>
            <Th>Customer Name</Th>
            <Th>Customer Phone Number</Th>
            <Th>Total Quantity</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!!orders?.length &&
            orders.sort(sort.sortByCreatedAt).map((order) => {
              return (
                <Tr key={order.id}>
                  <Th>{order.id}</Th>
                  <Th>{order.store.name}</Th>
                  <Th>{order.customer.name}</Th>
                  <Th>{order.customer.phoneNumber}</Th>
                  <Th>{getTotalQuantity(order.products)}</Th>
                  <Th>{getTotalPrice(order.products)}</Th>
                  <Th>
                    <Tag
                      size="xs"
                      p={2}
                      colorScheme={mapOrderStatusToColor[order.status]}
                    >
                      {order.status}
                    </Tag>
                  </Th>
                  <Th>
                    <VStack>
                      <Button
                        colorScheme="cyan"
                        size="xs"
                        onClick={() =>
                          viewProductOrdersHook.onOpen(order.products)
                        }
                      >
                        Lihat detail
                      </Button>
                      <Button
                        colorScheme="blue"
                        size="xs"
                        onClick={() => {
                          updateOrderStatusHook.onOpen({
                            id: order.id,
                            status: order.status
                          })
                        }}
                      >
                        Update Status
                      </Button>
                    </VStack>
                  </Th>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Layout>
  )
}
