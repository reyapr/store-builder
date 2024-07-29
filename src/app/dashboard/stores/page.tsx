'use client'
import StoreFormModal from '@/components/StoreModal'
import { createClient } from '@/utils/supabase/client'
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
  Tr,
  useToast
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { DeleteAlert, Layout } from '@/components'
import { useCreateStore } from '@/app/dashboard/stores/useCreateStore'
import { useUpdateStore } from '@/app/dashboard/stores/useUpdateStore'
import { useDeleteStore } from '@/app/dashboard/stores/useDeleteStore'
import { getStores } from '@/app/dashboard/stores/actions'

export default function Store() {
  const supabase = createClient()
  const toast = useToast()

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
      {/* <StoreFormModal
        title="Create new store"
        isOpen={createStoreHook.isOpen}
        onClose={createStoreHook.onClose}
        onSubmit={createStoreHook.submitNewStore}
      />
      <StoreFormModal
        title="Update store"
        isOpen={updateStoreHook.isOpen}
        onClose={updateStoreHook.handleEditClose}
        onSubmit={updateStoreHook.submitUpdateStore}
        data={updateStoreHook.currentEditForm}
      />
      <DeleteAlert
        isOpen={deleteStoreHook.isOpen}
        onClose={deleteStoreHook.handleDeleteClose}
        onSubmit={deleteStoreHook.submitDeleteStore}
        title="Delete Store"
        id={deleteStoreHook.targetDeleteStoreId}
      /> */}
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
