"use client";
import { Layout } from "@/app/[storeName]/components/Layout";
import { useStore } from "@/app/[storeName]/useStore";
import NumberInput from "@/components/NumberInput";
import { cartStore } from "@/stores/useCart";
import { toIDRFormat } from "@/utils/idr-format";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

export default function CartPage({
  params,
}: {
  params: { storeName: string };
}) {
  const cart = useStore(cartStore, (state) => state, params.storeName);
  const items = (cart.getProducts && cart.getProducts()) || [];
  const totalCartPrice = cart.getTotalPrice && cart.getTotalPrice();

  return (
    <Layout storeName={params.storeName}>
      <Card>
        <CardHeader>
          <Heading>Cart</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {items.map((product) => (
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
                <Spacer/>
                <Box alignSelf={'center'}>
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
        <Divider />
        <CardFooter>
          <Text>Total: {toIDRFormat(totalCartPrice)}</Text>
        </CardFooter>
      </Card>
    </Layout>
  );
}
