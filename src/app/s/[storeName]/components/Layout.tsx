import React from 'react'

import { Box } from '@chakra-ui/react'

// import { Navbar } from '@/app/s/[storeName]/components/Navbar'
import { Navbar } from '@/components/homepage'

interface LayoutProps {
  children: React.ReactNode
  storeName: string
  home?: boolean
}

export function Layout(props: LayoutProps) {
  return (
    <Box>
      <Navbar storeName={props.storeName} />
      <Box>{props.children}</Box>
    </Box>
  )
}
