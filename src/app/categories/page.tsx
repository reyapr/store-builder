"use client";
import { useCreateCategory } from "@/app/categories/use-create-category";
import { useUpdateCategory } from "@/app/categories/use-update-category";
import { useGetStore } from "@/app/stores/use-get-store";
import CategoryFormModal from "@/components/CategoryModal";
import Layout from "@/components/Layout";
import { ICategory } from "@/interfaces/category";
import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const toast = useToast();
  const [categories, setCategories] = useState([] as any[]);
  const {stores, fetchStores} = useGetStore(toast);
  
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  }
  
  const sortCategories = (a: ICategory, b: ICategory) => new Date(a.createdAt) > new Date(b.createdAt)? 1 : -1;
  
  const createCategoryHook = useCreateCategory(toast, fetchCategories);  
  const editCategoryHook = useUpdateCategory(toast, fetchCategories);
  
  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <CategoryFormModal
        title="Create new category"
        isOpen={createCategoryHook.isOpen}
        onClose={createCategoryHook.onClose}
        onSubmit={createCategoryHook.handleCreateNewCategory}
        stores={stores}
      />
      <CategoryFormModal
        title="Update category"
        isOpen={editCategoryHook.isOpen}
        onClose={editCategoryHook.onClose}
        onSubmit={editCategoryHook.handleSubmit}
        stores={stores}
        data={editCategoryHook.currentEditForm}
      />
      <Grid>
        <GridItem justifySelf='end' colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue" onClick={createCategoryHook.onOpen}>Create Category</Button>
        </GridItem>
      </Grid>
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Categories</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Store</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              categories.sort(sortCategories).map((category) => {
                return (
                  <Tr key={category.id}>
                    <Th>{category.id}</Th>
                    <Th>{category.name}</Th>
                    <Th>{category.store.name}</Th>
                    <Th>
                      <ButtonGroup gap={2}>
                        <Button colorScheme="blue" onClick={() => editCategoryHook.onOpen(category)}>Edit</Button>
                        <Button colorScheme="red">Delete</Button>
                      </ButtonGroup>
                    </Th>
                  </Tr>
                )
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
