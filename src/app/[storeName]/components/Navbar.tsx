import { useCartStore } from "@/stores/useCart";
import { Box, Flex, Icon, Spacer, Text } from "@chakra-ui/react";
import { MdOutlineShoppingCart } from "react-icons/md";

interface NavbarProps {
  storeName: string;
}

export function Navbar(props: NavbarProps) {
  const cart = useCartStore();
  
  return (
    <Flex bg='gray.700'>
      <Box margin={3}>
        <Text fontSize="2xl" fontWeight="bold" color={'white'}>
          {props.storeName}
        </Text>
      </Box>
      <Spacer />
      <Box margin={3} marginRight={6}>
        <Icon fontSize={'2xl'} color={'white'} as={MdOutlineShoppingCart}/>
      </Box>
    </Flex>
  )
}