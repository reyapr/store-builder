import React from 'react'

import { HStack, Button, Input } from '@chakra-ui/react'

export default function NumberInput({
  quantity,
  onAddQty,
  onRemoveQty
}: Props) {
  return (
    <HStack maxW={['100px', '140px']} gap={[0, 2]}>
      <Button onClick={onRemoveQty} bgColor="red.200" size={['sm', 'md']}>
        -
      </Button>
      <Input
        defaultValue={quantity}
        padding="0px"
        textAlign={'center'}
        size={['sm', 'md']}
      />
      <Button onClick={onAddQty} bgColor="cyan.200" size={['sm', 'md']}>
        +
      </Button>
    </HStack>
  )
}

type Props = {
  quantity: number
  productId: string
  onAddQty: () => void
  onRemoveQty: () => void
}
