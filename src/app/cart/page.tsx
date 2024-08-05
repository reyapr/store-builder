'use client'
import React, { useCallback, useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
  SimpleGrid,
  useToast,
  VStack
} from '@chakra-ui/react'
import axios from 'axios'

import OrdererInput from '@/app/s/[storeName]/cart/components/OrdererInput'
import { useStore } from '@/app/s/[storeName]/useStore'
import { Layout } from '@/components/homepage'
import NumberInput from '@/components/NumberInput'
import { IProduct } from '@/interfaces'
import { IOrderRequest } from '@/interfaces/order'
import { cartStore } from '@/stores/useCart'
import { toIDRFormat } from '@/utils/idr-format'

export default function CartPage({
  params
}: {
  params: { storeName: string }
}) {
  const toast = useToast()
  const cart = useStore(cartStore, (state) => state, 'app')
  const items = (cart.getProducts && cart.getProducts()) || []
  const totalCartPrice = cart.getTotalPrice && cart.getTotalPrice()

  const [input, setInput] = useState({
    name: '',
    phoneNumber: '',
    address: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const isSubmitDisabled =
    !input.name || !input.phoneNumber || !input.address || !items.length

  const redirectToWA = () => {
    const text =
      `Assalamualaikum, saya mau order.
    ${items
      .map((product, i) => {
        return `\n${i + 1}. *${product.name}*
      Quantity: ${product.quantity}
      Harga (@): ${toIDRFormat(product.price)}
      Total Harga: ${toIDRFormat(product.price * product.quantity)}`
      })
      .join(' ')}` +
      `\n\nTotal : *${toIDRFormat(totalCartPrice)}*` +
      `\n\n*Pengiriman* : ${input.address}\n` +
      '--------------------------------' +
      '\n*Nama :*' +
      `\n${input.name} ( ${input.phoneNumber} )` +
      '\n\n*Alamat :*' +
      `\n${input.address}` +
      `\nVia ${location.origin}`

    const waUrl = `https://wa.me/+6285723087803?text=${encodeURI(text)}`
    window.location.replace(waUrl)
  }

  const createOrder = async () => {
    const request: IOrderRequest = {
      storeName: params.storeName,
      items: items,
      totalPrice: totalCartPrice,
      orderer: input
    }

    await axios.post(`/api/orders`, request)
  }

  const handleOrder = async () => {
    try {
      await createOrder()
      cart.clearCart()
      redirectToWA()
    } catch (error) {
      let errorMessage = 'Gagal membuat pesanan. Silahkan coba lagi.'

      if ((error as any).response.data.error.includes('out of stock')) {
        errorMessage = (error as any).response.data.error
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }

  const handleAddQty = useCallback(
    (product: IProduct.IProductCart) => {
      cart.addProduct(product)
    },
    [cart]
  )

  const handleRemoveQty = useCallback(
    (productId: string) => {
      cart.reduceQuantity(productId)
    },
    [cart]
  )

  return (
    <Layout storeName={params.storeName}>
      <SimpleGrid margin={3} spacing={4}>
        <Card>
          <CardHeader>
            <Heading>Keranjang</Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {items.map((product) => (
                <Flex
                  key={product.id}
                  flex={1}
                  w="full"
                  justifyContent="space-between"
                  direction={['column', 'row']}
                  align="center"
                >
                  <Flex alignSelf={['start']}>
                    <Box boxSize={20} marginRight={5}>
                      <Image
                        src={product.imageUrl}
                        alt={product.description}
                        sizes="sm"
                      />
                    </Box>
                    <Box>
                      <Heading size="md">{product.name}</Heading>
                      <Text>Price: {toIDRFormat(product.price)}</Text>
                      <Text>Quantity: {product.quantity}</Text>
                    </Box>
                  </Flex>

                  <Box alignSelf={['end', 'center']}>
                    <NumberInput
                      quantity={product.quantity}
                      productId={product.id}
                      onAddQty={() => handleAddQty(product)}
                      onRemoveQty={() => handleRemoveQty(product.id)}
                    />
                  </Box>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading>Data Pemesan</Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <OrdererInput input={input} handleChange={handleChange} />
          </CardBody>
        </Card>
        <Card>
          <Divider color="gray.300" />
          <VStack p={3}>
            <Box alignSelf="center">
              <Text fontSize="xx-large">
                Total: <b>{toIDRFormat(totalCartPrice)}</b>
              </Text>
            </Box>
            <Button
              w="full"
              py={6}
              isDisabled={isSubmitDisabled}
              bgColor="blue.200"
              onClick={handleOrder}
            >
              <Text fontSize="xx-large">Pesan</Text>
            </Button>
          </VStack>
        </Card>
      </SimpleGrid>
    </Layout>
  )
}
