import React from 'react'

import {
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
  Text
} from '@chakra-ui/react'

import { IProduct } from '@/interfaces/product'
import { toIDRFormat } from '@/utils/idr-format'

interface ProductCardProps {
  product: IProduct
  addToCart: (product: IProduct) => void
}

export default function ProductCard(props: ProductCardProps) {
  const product: IProduct = props.product
  const defaultImage =
    'https://qviqbtgkunhmasnzbmoh.supabase.co/storage/v1/object/public/storebuilder/store-builder-default.jpeg'

  return (
    <Card>
      <CardBody>
        <Image
          src={product.imageUrl || defaultImage}
          width="100%"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product.name}</Heading>
          <Text fontSize="xs">{product.description}</Text>
        </Stack>
      </CardBody>
      <CardFooter paddingTop={0}>
        <Text color="blue.600" fontSize="xl">
          {toIDRFormat(product.price)}
        </Text>
      </CardFooter>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => props.addToCart(props.product)}
          >
            Tambah ke Cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
