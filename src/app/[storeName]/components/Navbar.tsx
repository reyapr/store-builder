import { useStore } from "@/app/[storeName]/useStore";
import { cartStore } from "@/stores/useCart";
import { Badge, Box, Flex, Icon, IconButton, Spacer, Text } from "@chakra-ui/react";
import { MdOutlineShoppingCart } from "react-icons/md";

interface NavbarProps {
  storeName: string;
}

export function Navbar(props: NavbarProps) {
  const cart = useStore(cartStore, (state) => state, props.storeName);
  
  return (
    <Flex bg='gray.700'>
      <Box margin={3}>
        <Text fontSize="2xl" fontWeight="bold" color={'white'}>
          {props.storeName}
        </Text>
      </Box>
      <Spacer />
      <Box margin={3} marginRight={6}>
        <IconButton
          aria-label="cart"
          onClick={() => {}}
          variant={'outline'}
          icon={
            <Box>
              <Icon fontSize={'2xl'} color={'white'} as={MdOutlineShoppingCart}/>
              <Badge colorScheme="red" borderRadius="full" variant="solid" position="absolute" top={-1} right={-1}>
                {cart.getTotalQuantity && cart.getTotalQuantity()}
              </Badge>
            </Box>
          }
        />
      </Box>
    </Flex>
  )
}