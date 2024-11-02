import React from 'react'

import { Box, Alert, AlertIcon } from '@chakra-ui/react'

export default function Error({ error }: { error: Error }) {
  return (
    <Box p={3} mb={3}>
      <Alert status="error" mb={3} height="48px">
        <AlertIcon />
        {error.message}
      </Alert>
    </Box>
  )
}
