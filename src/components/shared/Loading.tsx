import React from 'react'

import { Flex, Spinner } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex flex={1} justify="center" color="blue.400" align="center" minH="80vh">
      <Spinner />
    </Flex>
  )
}
