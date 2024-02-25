'use client';
import Layout from "@/components/Layout";
import { Button, ButtonGroup, Grid, GridItem, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([] as any[]);
  
  const sortProducts = (a: any, b: any) => new Date(a.createdAt) > new Date(b.createdAt)? 1 : -1;
  return (
    <Layout>
      <Grid>
        <GridItem justifySelf='end' colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue" onClick={() => {}}>Create Product</Button>
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
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              products.sort(sortProducts).map((product) => {
                return (
                  <Tr key={product.id}>
                    <Th>{product.id}</Th>
                    <Th>{product.name}</Th>
                    <Th>{product.price}</Th>
                    <Th>{product.quantity}</Th>
                    <Th>{product.store.name}</Th>
                    <Th>{product.category.name}</Th>
                    <Th>
                      <ButtonGroup gap={2}>
                        <Button colorScheme="blue" onClick={() => {}}>Edit</Button>
                        <Button colorScheme="red" onClick={() => {}}>Delete</Button>
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