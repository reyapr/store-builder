import React from 'react'

import {
  Box,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AiOutlineShop,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineTags,
  AiOutlineCalendar
} from 'react-icons/ai'

const listItems: ListItem[] = [
  {
    id: 1,
    text: 'Toko',
    path: '/dashboard/stores',
    icon: AiOutlineShop
  },
  {
    id: 2,
    text: 'Produk',
    path: '/dashboard/products',
    icon: AiOutlineShopping
  },
  {
    id: 3,
    text: 'Order',
    path: '/dashboard/orders',
    icon: AiOutlineShoppingCart
  },
  {
    id: 4,
    text: 'Kategori',
    path: '/dashboard/categories',
    icon: AiOutlineTags
  },
  {
    id: 5,
    text: 'Jadwal',
    path: '/dashboard/schedules',
    icon: AiOutlineCalendar
  }
]

const Sidebar = ({ ...rest }: Props) => {
  const pathname = usePathname()
  return (
    <Box
      as="aside"
      borderRight="2px"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      w={{ base: '100%', lg: '60' }}
      top="0"
      pos="fixed"
      h="100%"
      minH="100vh"
      bg="white"
      zIndex={99}
      {...rest}
    >
      <Link href="/dashboard">
        <HStack p="2.5" h="57px" justify="space-between">
          <Heading as="h1" size="md">
            Admin Dashboard
          </Heading>
        </HStack>
      </Link>
      <Box>
        <List spacing={0} p="0.5">
          {listItems.map(({ id, icon, text, path }) => (
            <Link href={path} key={id} prefetch>
              <ListItem
                as={HStack}
                spacing={0}
                h="10"
                pl="2.5"
                cursor="pointer"
                backgroundColor={pathname === path ? 'gray.200' : ''}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                rounded="md"
              >
                <ListIcon boxSize={5} as={icon} />
                {text && <Text>{text}</Text>}
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar

type ListItem = {
  id: number
  path: string
  text: string
  icon: React.ElementType
}

type Props = {
  display?: {
    base: string
    lg: string
  }
}
