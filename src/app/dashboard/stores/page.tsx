'use client'

import React from 'react'

import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'

import { Layout } from '@/components'
i
import { getStores } from '@/app/dashboard/stores/actions'

export default function Store() {
  const { data: stores, isFetching, error } = getStores()
  // const createStoreHook = useCreateStore(toast, fetchStores, supabase)
  // const updateStoreHook = useUpdateStore(toast, fetchStores, supabase)
  // const deleteStoreHook = useDeleteStore(toast, fetchStores, supabase)

  const sortByCreatedAt = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Toko', path: '/dashboard/stores' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
      rightHeaderComponent={
        <Button colorScheme="blue" size="sm" onClick={() => {}}>
          Create Store
        </Button>
      }
    >
      <Grid>
        <GridItem
          justifySelf="end"
          colEnd={13}
          paddingTop={3}
          paddingRight={3}
        ></GridItem>
      </Grid>
      <TableContainer>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!stores?.length &&
              stores.sort(sortByCreatedAt).map((store) => {
                return (
                  <Tr key={store.id}>
                    <Th>{store.id}</Th>
                    <Th>{store.name}</Th>
                    <Th>
                      <ButtonGroup gap={2}>
                        <Button colorScheme="blue" size="sm" onClick={() => {}}>
                          Edit
                        </Button>
                        <Button colorScheme="red" size="sm" onClick={() => {}}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Th>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
