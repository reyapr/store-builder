"use client";
import { useGetStore } from "@/app/stores/use-get-store";
import CategoryFormModal from "@/components/CategoryModal";
import Layout from "@/components/Layout";
import { ICreateCategoryRequest } from "@/interfaces/category";
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
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCreateNewCategory = (request: ICreateCategoryRequest) => async () => {
    try {
      await axios.post('/api/categories', request);
      fetchCategories();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  }
  
  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <CategoryFormModal
        title="Create new category"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateNewCategory}
        stores={stores}
      />
      <Grid>
        <GridItem justifySelf='end' colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue" onClick={onOpen}>Create Category</Button>
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
              categories.map((category, index) => {
                return (
                  <Tr key={category.id}>
                    <Th>{category.id}</Th>
                    <Th>{category.name}</Th>
                    <Th>{category.store.name}</Th>
                    <Th>
                      <ButtonGroup gap={2}>
                        <Button colorScheme="blue">Edit</Button>
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
