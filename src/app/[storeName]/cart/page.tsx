"use client"
import { Layout } from '@/app/[storeName]/components/Layout';
import { useStore } from '@/app/[storeName]/useStore';
import { cartStore } from '@/stores/useCart';
import { toIDRFormat } from '@/utils/idr-format';
import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';

export default function CartPage({ params }: { params: { storeName: string } }) {
  
  const cart = useStore(cartStore, (state) => state, params.storeName)
  const items = cart.getProducts && cart.getProducts() || []
  const totalCartPrice = cart.getTotalPrice && cart.getTotalPrice()
  
  return (
    <Layout storeName={params.storeName}>
      <Card>
        <CardHeader>
          <Heading>Cart</Heading>
        </CardHeader>
        
        <CardBody>
          <Stack divider={<StackDivider/>} spacing='4'>
            {items.map(product => (
              <Box key={product.id}>
                <Heading size='md'>
                  {product.name}
                </Heading>
                <Text>Price: {toIDRFormat(product.price)}</Text>
                <Text>Quantity: {product.quantity}</Text>
              </Box>
            ))}
          </Stack>
        </CardBody>
        <Divider/>
        <CardFooter>
          <Text>Total: {toIDRFormat(totalCartPrice)}</Text>
        </CardFooter>
      </Card>
    </Layout>
  )
}