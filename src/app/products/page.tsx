"use client";
import { useGetCateogries } from "@/app/categories/use-get-category";
import { useCreateProduct } from "@/app/products/use-create-product";
import { useGetStore } from "@/app/stores/use-get-store";
import Layout from "@/components/Layout";
import ProductFormModal from "@/components/ProductModal";
import { IProduct } from "@/interfaces/product";
import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const toast = useToast();
  const [products, setProducts] = useState([] as IProduct[]);
  const {stores, fetchStores} = useGetStore(toast);
  const {categories, fetchCategories} = useGetCateogries(toast);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  };
  
  const toIDRFormat = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  }
  
  const createProductHook = useCreateProduct(toast, fetchProducts);
  
  useEffect(() => {
    fetchProducts();
    fetchStores();
    fetchCategories();
  }, []);

  const sortProducts = (a: any, b: any) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
  return (
    <Layout>
      <ProductFormModal
        title="Create new product"
        isOpen={createProductHook.isOpen}
        onClose={createProductHook.onClose}
        onSubmit={createProductHook.handleCreateProduct}
        stores={stores}
        categories={categories}
      />
      <Grid>
        <GridItem justifySelf="end" colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue" onClick={createProductHook.onOpen}>
            Create Product
          </Button>
        </GridItem>
      </Grid>
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Products</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              <Th>Store</Th>
              <Th>Categories</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.sort(sortProducts).map((product) => {
              return (
                <Tr key={product.id}>
                  <Th>{product.id}</Th>
                  <Th>{product.name}</Th>
                  <Th>{toIDRFormat(product.price)}</Th>
                  <Th>{product.quantity}</Th>
                  <Th>{product.store.name}</Th>
                  <Th>{product.categories.map(category => {
                    return (
                      <Tag key={category.id} colorScheme="blue" marginRight={1}>
                        {category.name}
                      </Tag>
                    )
                  })}</Th>
                  <Th>
                    <ButtonGroup gap={2}>
                      <Button colorScheme="blue" onClick={() => {}}>
                        Edit
                      </Button>
                      <Button colorScheme="red" onClick={() => {}}>
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
