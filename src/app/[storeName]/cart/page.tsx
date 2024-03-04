"use client";
import OrdererInput from "@/app/[storeName]/cart/components/OrdererInput";
import { Layout } from "@/app/[storeName]/components/Layout";
import { useStore } from "@/app/[storeName]/useStore";
import NumberInput from "@/components/NumberInput";
import { cartStore } from "@/stores/useCart";
import { toIDRFormat } from "@/utils/idr-format";
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
} from "@chakra-ui/react";
import { clear } from "console";
import { useState } from "react";

export default function CartPage({
  params,
}: {
  params: { storeName: string };
}) {
  const cart = useStore(cartStore, (state) => state, params.storeName);
  const items = (cart.getProducts && cart.getProducts()) || [];
  const totalCartPrice = cart.getTotalPrice && cart.getTotalPrice();

  const [input, setInput] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  
  const isSubmitDisabled = !input.name || !input.phone || !input.address;
  
  const handleOrder = () => {
    const text = `Assalamualaikum, saya mau order .
    
    ${items.map((product, i) => {
      return `*${i}. ${product.name}* 
      Quantity: ${product.quantity} 
      Harga (@): ${toIDRFormat(product.price)} 
      Total Harga: ${toIDRFormat(product.price * product.quantity)}\n`;
    })}
    
    Total : *${totalCartPrice}*
    
    Pengiriman : *${input.address}*
    
    --------------------------------
    *Nama :*
    ${input.name} ( ${input.phone} ) 
    
    *Alamat :*
    ${input.address}
    
    Via https://test.id`
    const waUrl = `https://wa.me/${input.phone}?text=${text}`
    window.open(waUrl, '_blank');
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
                <Button isDisabled={isSubmitDisabled} bgColor="blue.200" onClick={handleOrder}>Pesan</Button>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Layout>
  );
}
