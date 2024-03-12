"use client";
import { useCreateCategory } from "@/app/dashboard/categories/useCreateCategory";
import { useDeleteCategory } from "@/app/dashboard/categories/useDeleteCategory";
import { useGetCateogries } from "@/app/dashboard/categories/useGetCategory";
import { useUpdateCategory } from "@/app/dashboard/categories/useUpdateCategory";
import { useGetStore } from "@/app/dashboard/stores/useGetStore";
import CategoryFormModal from "@/components/CategoryModal";
import { DeleteAlert } from "@/components/DeleteAlert";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const toast = useToast();
  const {stores, fetchStores} = useGetStore(toast);
  const {categories, fetchCategories} = useGetCateogries(toast);
  
  const sortCategories = (a: ICategory, b: ICategory) => new Date(a.createdAt) > new Date(b.createdAt)? 1 : -1;
  
  const createCategoryHook = useCreateCategory(toast, fetchCategories);  
  const editCategoryHook = useUpdateCategory(toast, fetchCategories);
  const deleteCategoryHook = useDeleteCategory(toast, fetchCategories);
  
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
      <DeleteAlert
        isOpen={deleteCategoryHook.isOpen}
        onClose={deleteCategoryHook.onClose}
        onSubmit={deleteCategoryHook.handleDeleteCategory}
        title="Delete Category"
        id={deleteCategoryHook.targetDeleteCategoryId}
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
              categories.sort(sortCategories).map((category: ICategory) => {
                return (
                  <Tr key={category.id}>
                    <Th>{category.id}</Th>
                    <Th>{category.name}</Th>
                    <Th>{category.store?.name}</Th>
                    <Th>
                      <ButtonGroup gap={2}>
                        <Button colorScheme="blue" onClick={() => editCategoryHook.onOpen(category)}>Edit</Button>
                        <Button colorScheme="red" onClick={() => deleteCategoryHook.onOpen(category.id)}>Delete</Button>
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
