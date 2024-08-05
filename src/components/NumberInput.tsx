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
    <HStack maxW={['100px', '140px']} gap={[0, 2]}>
      <Button
        onClick={() => handleQuantity(-1)}
        bgColor="red.200"
        size={['sm', 'md']}
      >
        -
      </Button>
      <Input
        value={props.quantity}
        padding="0px"
        textAlign={'center'}
        size={['sm', 'md']}
      />
      <Button
        onClick={() => handleQuantity(1)}
        bgColor="cyan.200"
        size={['sm', 'md']}
      >
        +
      </Button>
    </HStack>
  )
}
