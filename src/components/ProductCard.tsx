import { IProduct } from "@/interfaces/product";
import { toIDRFormat } from "@/utils/idr-format";
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
  Text,
} from "@chakra-ui/react";

interface ProductCardProps {
  product: IProduct;
  addToCart: (product: IProduct) => void;
}

export function ProductCard(props: ProductCardProps) {
  const product: IProduct = props.product

  return (
    <Card>
      <CardBody>
        <Image
          src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product.name}</Heading>
          <Text fontSize="xs">
            {'desc'}
          </Text>
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
          <Button variant="solid" colorScheme="blue" onClick={() => props.addToCart(props.product)}>
            Tambah ke Cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
