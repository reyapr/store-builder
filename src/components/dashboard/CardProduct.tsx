'use client'

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image
} from '@chakra-ui/react'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

import { IStore } from '@/interfaces/store'
import { ICategory } from '@/interfaces/category'

export default function ProductSimple({
  name,
  price,
  stock,
  store,
  categories,
  imageUrl,
  description,
  onEdit,
  onDelete
}: Props) {
  return (
    <Center>
      <Box
        role="group"
        maxW="330px"
        w="full"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="md"
        rounded="lg"
        pos="relative"
        zIndex={1}
      >
        <Image
          height={160}
          width="full"
          objectFit="cover"
          src={imageUrl}
          alt="#"
        />

        <Stack align="left" p={6}>
          <Text color="gray.500" fontSize="sm" textTransform="uppercase">
            {store.name}
          </Text>
          <Text fontSize="md" fontFamily="body">
            {name}
          </Text>
          <Text fontSize="sm">{price}</Text>
        </Stack>
        <Stack px={6} pb={3}>
          <ButtonGroup gap={2}>
            <Button size="sm" colorScheme="blue" onClick={onEdit}>
              Edit
            </Button>
            <Button size="sm" colorScheme="red" onClick={onDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </Stack>
      </Box>
    </Center>
  )
}

interface Props {
  name: string
  price: string
  stock: number
  store: IStore
  categories: ICategory[]
  imageUrl: string
  description: string
  onEdit: () => void
  onDelete: () => void
}
