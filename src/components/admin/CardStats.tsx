import React from 'react'

import { VStack, Text } from '@chakra-ui/react'

export default function CardStats({ label, value }: Props) {
  return (
    <VStack
      boxShadow="md"
      rounded="xl"
      border="1px solid #eee"
      p={2}
      alignItems="start"
      spacing={0}
    >
      <Text color="gray.800" m={0}>
        {label}{' '}
      </Text>
      <Text fontSize="24px" fontWeight="bold" m={0}>
        {value}
      </Text>
    </VStack>
  )
}

type Props = {
  label: string
  value: number | string
}
