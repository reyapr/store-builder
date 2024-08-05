'use client'
import React, { useState } from 'react'

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
  Spacer,
  Stack,
  StackDivider,
  Text,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import axios from 'axios'

import OrdererInput from '@/app/s/[storeName]/cart/components/OrdererInput'
import { useStore } from '@/app/s/[storeName]/useStore'
import { Layout } from '@/components/homepage'
import NumberInput from '@/components/NumberInput'
import { IOrderRequest } from '@/interfaces/order'
import { cartStore } from '@/stores/useCart'
import { toIDRFormat } from '@/utils/idr-format'

export default function CartPage({
  params
}: {
  params: { storeName: string }
}) {
  const toast = useToast()
  const cart = useStore(cartStore, (state) => state, params.storeName)
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

  return (
    <Layout storeName={params.storeName}>
      <SimpleGrid margin={3} spacing={2}>
        <Card>
          <CardHeader>
            <Heading>Cart</Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {items
                .filter((p) => p.quantity > 0)
                .map((product) => (
                  <Flex key={product.id}>
                    <Box boxSize={20} marginRight={5}>
                      <Image
                        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        alt="Green double couch with wooden legs"
                        sizes="sm"
                      />
                    </Box>
                    <Box>
                      <Heading size="md">{product.name}</Heading>
                      <Text>Price: {toIDRFormat(product.price)}</Text>
                      <Text>Quantity: {product.quantity}</Text>
                    </Box>
                    <Spacer />
                    <Box alignSelf="center">
                      <NumberInput
                        quantity={product.quantity}
                        productId={product.id}
                        updateProductQuantity={cart.updateProductQuantity}
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
          <CardHeader>
            <Heading>Order Summary</Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <Flex>
              <Box alignSelf="center">
                <Text>Total: {toIDRFormat(totalCartPrice)}</Text>
              </Box>
              <Spacer />
              <Box alignSelf="center">
                <Button
                  isDisabled={isSubmitDisabled}
                  bgColor="blue.200"
                  onClick={handleOrder}
                >
                  Pesan
                </Button>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Layout>
  )
}
