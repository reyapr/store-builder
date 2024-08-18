'use client'
import React, { useCallback, useRef } from 'react'

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
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay
} from '@chakra-ui/react'
import axios from 'axios'
import { useFormik } from 'formik'
import { FaTrash } from 'react-icons/fa6'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import OrdererInput from '@/app/s/[storeName]/cart/components/OrdererInput'
import { useStore } from '@/app/s/[storeName]/useStore'
import { Layout } from '@/components/homepage'
import NumberInput from '@/components/NumberInput'
import { IProduct, IOrder } from '@/interfaces'
import { IOrderRequest } from '@/interfaces/order'
import { cartStore } from '@/stores/useCart'
import { currency, schema } from '@/utils'

export default function CartPage({ params }: Props) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const cart = useStore(cartStore, (state) => state, 'app')
  const items = (cart.getProducts && cart.getProducts()) || []
  const totalCartPrice = cart.getTotalPrice && cart.getTotalPrice()

  const { dirty, errors, isValid, handleSubmit, values, setFieldValue } =
    useFormik<IOrder.IOrdererInputForm>({
      initialValues: {
        name: '',
        phoneNumber: '',
        email: '',
        address: ''
      },
      validateOnChange: true,
      validationSchema: toFormikValidationSchema(schema.orderInputForm),
      onSubmit: async () => {
        try {
          await createOrder()
          cart.clearCart()
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
    })

  const createOrder = async () => {
    const request: IOrderRequest = {
      storeName: params.storeName,
      items: items,
      totalPrice: totalCartPrice,
      orderer: values
    }

    await axios.post(`/api/orders`, request)
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

  const clearCart = useCallback(() => {
    cart.clearCart()
    toast({
      title: 'Berhasil mengosongkan keranjang',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
    onClose()
  }, [cart, onClose, toast])

  return (
    <Layout storeName={params.storeName}>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bersihkan keranjang
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah anda yakin ingin menghapus semua item di keranjang?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={clearCart} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <SimpleGrid margin={3} spacing={4}>
        <Card>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading>Keranjang</Heading>
              {!!items.length && (
                <Button colorScheme="red" onClick={onOpen}>
                  <FaTrash />
                </Button>
              )}
            </Flex>
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
                      <Text>Price: {currency.toIDRFormat(product.price)}</Text>
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

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <Heading>Data Pemesan</Heading>
            </CardHeader>

            <Divider color="gray.300" />
            <CardBody>
              <OrdererInput
                order={values}
                errors={errors}
                onChange={(e) => setFieldValue(e.target.name, e.target.value)}
              />
            </CardBody>
          </Card>
          <Card>
            <Divider color="gray.300" />
            <VStack p={3}>
              <Box alignSelf="center">
                <Text fontSize="xx-large">
                  Total: <b>{currency.toIDRFormat(totalCartPrice)}</b>
                </Text>
              </Box>
              <Button
                w="full"
                py={6}
                isDisabled={!dirty || !isValid}
                bgColor="blue.200"
                type="submit"
              >
                <Text fontSize="xx-large">Pesan</Text>
              </Button>
            </VStack>
          </Card>
        </form>
      </SimpleGrid>
    </Layout>
  )
}

type Props = {
  params: { storeName: string }
}
