'use client'

import React from 'react'

import { Flex, Stack, Text } from '@chakra-ui/react'

import { Layout } from '@/components'

export default function HomeDashboard() {
  const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard' }]

  return (
    <Layout breadcrumbs={breadcrumbs} isAdmin={false}>
      <Flex
        style={{
          display: 'flex',
          flex: 11,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Stack>
          <Text>Halaman customer sedang dalam development</Text>
          <Text>berisikan informasi rekap order yang diterima</Text>
        </Stack>
      </Flex>
    </Layout>
  )
}
