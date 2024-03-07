import { useStore } from "@/app/s/[storeName]/useStore";
import { cartStore } from "@/stores/useCart";
import { Badge, Box, Flex, Icon, IconButton, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineShoppingCart } from "react-icons/md";

interface NavbarProps {
  storeName: string;
}

export function Navbar(props: NavbarProps) {
  const cart = useStore(cartStore, (state) => state, props.storeName);
  const router = useRouter();
  const quantity = cart.getTotalQuantity && cart.getTotalQuantity();
  
  return (
    <Flex bg='gray.700'>
      <Box margin={3}>
        <Link href={`/s/${props.storeName}`}>
          <Text fontSize="2xl" fontWeight="bold" color={'white'}>
            {props.storeName}
          </Text>
        </Link>
       
      </Box>
      <Spacer />
      <Box margin={3} marginRight={6}>
        <IconButton
          aria-label="cart"
          onClick={() => router.push(`${props.storeName}/cart`)}
          variant={'outline'}
          icon={
            <Box>
              <Icon fontSize={'2xl'} color={'white'} as={MdOutlineShoppingCart}/>
              {quantity > 0 && 
                <Badge colorScheme="red" borderRadius="full" variant="solid" position="absolute" top={-1} right={-1}>
                  {quantity}
                </Badge>
              }
            </Box>
          }
        />
      </Box>
    </Flex>
  )
}