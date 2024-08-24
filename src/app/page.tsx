'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid
} from '@chakra-ui/react'
import { startOfWeek, addDays, isSameDay, format } from 'date-fns'
import { id } from 'date-fns/locale'

import { getProducts } from '@/app/admin/products/actions'
import { getSchedules } from '@/app/admin/schedules/actions'
import { useStore } from '@/app/s/[storeName]/useStore'
import { CardProduct, Layout } from '@/components/homepage'
import TabContent from '@/components/homepage/TabContent'
import { IProduct } from '@/interfaces'
import { cartStore } from '@/stores/useCart'
import { date as dateUtils } from '@/utils'

export default function Home() {
  const [query, setQuery] = useState<string>('')
  const [_, setSelectedDate] = useState(new Date())
  const { data: schedules, isFetching, error } = getSchedules()

  const cart = useStore(cartStore, (state) => state, 'app')

  const handleAddQty = useCallback(
    (product: IProduct.IProductResponse) => {
      cart.addProduct(IProduct.IProduct.fromData(product))
    },
    [cart]
  )

  const handleRemoveQty = useCallback(
    (productId: string) => {
      cart.reduceQuantity(productId)
    },
    [cart]
  )

  const handleUpdateQty = useCallback(
    (productId: string, qty: number) => {
      cart.updateProductQuantity(productId, qty)
    },
    [cart]
  )

  const sortProducts = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
  const {
    data: products,
    isFetching: isFetchingProducts,
    error: isErrorProducts,
    refetch: refetchProducts
  } = getProducts({ q: query })

  const weekDates = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return Array(7)
      .fill(0)
      .map((_, i) => addDays(weekStart, i))
  }, [])

  useEffect(() => {
    refetchProducts()
  }, [query, refetchProducts])

  const handleTabChange = (index: number) => {
    setSelectedDate(weekDates[index])
  }

  const getDefaultIndex = () => {
    const today = new Date()
    return weekDates.findIndex((date) => isSameDay(date, today))
  }

  return (
    <Layout isFetching={isFetching} error={error as Error} onSearch={setQuery}>
      {query ? (
        <SimpleGrid columns={[1, 4]} gap={6}>
          {!!products?.length &&
            products
              .sort(sortProducts)
              .map((product) => (
                <CardProduct
                  qty={
                    cart.getTotalQuantity
                      ? cart.getTotalQuantity(product.id)
                      : 0
                  }
                  onUpdateQty={(qty) => handleUpdateQty(product.id, qty)}
                  onAddQty={() => handleAddQty(product)}
                  onRemoveQty={() => handleRemoveQty(product.id)}
                  product={product}
                  key={product.id}
                />
              ))}
        </SimpleGrid>
      ) : (
        <Tabs
          isFitted
          onChange={handleTabChange}
          defaultIndex={getDefaultIndex()}
          flex={1}
          variant="soft-rounded"
          colorScheme="green"
        >
          <TabList>
            {weekDates.map((date) => (
              <Tab key={date.toISOString()} color="gray.400">
                {format(date, 'EEEE', { locale: id }).replace(
                  /minggu/i,
                  'Ahad'
                )}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {weekDates.map((date) => (
              <TabPanel key={date.toISOString()}>
                {!!schedules?.length && (
                  <TabContent
                    cart={cart}
                    query={query}
                    day={date}
                    schedules={schedules}
                    onUpdateQty={(productId, qty) =>
                      handleUpdateQty(productId, qty)
                    }
                    onAddQty={(product) => handleAddQty(product)}
                    onRemoveQty={(productId) => handleRemoveQty(productId)}
                  />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Layout>
  )
}
