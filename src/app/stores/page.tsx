'use client';
import StoreFormModal from "@/components/StoreModal";
import Layout from "@/components/Layout";
import { createClient } from "@/utils/supabase/client";
import { Button, ButtonGroup, Grid, GridItem, Table, TableCaption, TableContainer, Tag, Tbody, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { DeleteAlert } from "@/components/DeleteAlert";
import { useCreateStore } from "@/app/stores/useCreateStore";
import { useUpdateStore } from "@/app/stores/useUpdateStore";
import { useDeleteStore } from "@/app/stores/useDeleteStore";
import { useGetStore } from "@/app/stores/useGetStore";

export default function Store() {
  const supabase = createClient();
  const toast = useToast();
 
  const { stores, fetchStores } = useGetStore(toast);
  const createStoreHook = useCreateStore(toast, fetchStores, supabase);
  const updateStoreHook = useUpdateStore(toast, fetchStores, supabase);
  const deleteStoreHook = useDeleteStore(toast, fetchStores, supabase);
  
  const sortByCreatedAt = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;

  useEffect(() => {
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <StoreFormModal 
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
      />
       <Grid>
        <GridItem justifySelf="end" colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue" onClick={createStoreHook.onOpen}>
            Create Store
          </Button>
        </GridItem>
      </Grid>
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Store</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stores.sort(sortByCreatedAt).map((store) => {
              return (
                <Tr key={store.id}>
                  <Th>{store.id}</Th>
                  <Th>{store.name}</Th>
                  <Th>
                    <ButtonGroup gap={2}>
                      <Button colorScheme="blue" onClick={() => updateStoreHook.handleEdit(store)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" onClick={() => deleteStoreHook.handleOpenDeleteModal(store.id)}>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Th>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}