import React from 'react'

import {
  Box,
  Button,
  HStack,
  Heading,
  Link as LinkChakra,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  AiOutlineLogout,
  AiOutlineShop,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineTags,
  AiOutlineCalendar
} from 'react-icons/ai'

import { DASHBOARD_LOGIN_PATH } from '@/constants/auth'
import { createClient } from '@/utils/supabase/client'

const Sidebar = ({ ...rest }: Props) => {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      document.cookie =
        'sb-qviqbtgkunhmasnzbmoh-auth-token-code-verifier=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      if (error) {
        console.error('Error logging out:', error)
      }
      router.replace(DASHBOARD_LOGIN_PATH)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  const listItems: SidebarMenuItem[] = [
    {
      id: 1,
      text: 'Toko',
      path: '/admin/stores',
      icon: AiOutlineShop
    },
    {
      id: 2,
      text: 'Produk',
      path: '/admin/products',
      icon: AiOutlineShopping
    },
    {
      id: 3,
      text: 'Order',
      path: '/admin/orders',
      icon: AiOutlineShoppingCart
    },
    {
      id: 4,
      text: 'Kategori',
      path: '/admin/categories',
      icon: AiOutlineTags
    },
    {
      id: 5,
      text: 'Jadwal',
      path: '/admin/schedules',
      icon: AiOutlineCalendar
    },
    {
      id: 6,
      text: 'Logout',
      onClick: onOpen,
      icon: AiOutlineLogout
    }
  ]

  const SidebarItem = ({
    path,
    onClick,
    children
  }: {
    path?: string
    onClick?: SidebarMenuItem['onClick']
    children: React.ReactNode
  }) => {
    return path ? (
      <Link href={path} prefetch>
        {children}
      </Link>
    ) : (
      <LinkChakra onClick={onClick}>{children}</LinkChakra>
    )
  }

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
      <Link href="/admin">
        <HStack p="2.5" h="57px" justify="space-between">
          <Heading as="h1" size="md">
            Admin Dashboard
          </Heading>
        </HStack>
      </Link>
      <Box>
        <List spacing={0} p="0.5">
          {listItems.map(({ id, icon, text, path, onClick }) => (
            <SidebarItem key={id} path={path} onClick={onClick}>
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
            </SidebarItem>
          ))}
        </List>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yakin ingin logout?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button colorScheme="red" mr={3} onClick={handleLogout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Sidebar

type SidebarMenuItem = {
  id: number
  path?: string
  onClick?: () => void
  text: string
  icon: React.ElementType
}

type Props = {
  display?: {
    base: string
    lg: string
  }
}
