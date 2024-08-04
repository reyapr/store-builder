import React from 'react'

import { HStack, Button, Input } from '@chakra-ui/react'

interface INumberInputProps {
  quantity: number
  productId: string
  // eslint-disable-next-line no-unused-vars
  updateProductQuantity: (productId: string, num: number) => void
}

export default function NumberInput(props: INumberInputProps) {
  const handleQuantity = (num: number) => {
    props.updateProductQuantity(props.productId, num)
  }

  return (
    <HStack maxW="140px">
      <Button onClick={() => handleQuantity(1)} bgColor="cyan.200">
        +
      </Button>
      <Input value={props.quantity} padding="0px" textAlign={'center'} />
      <Button onClick={() => handleQuantity(-1)} bgColor="red.200">
        -
      </Button>
    </HStack>
  )
}
