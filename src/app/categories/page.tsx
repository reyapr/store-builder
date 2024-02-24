"use client";
import Layout from "@/components/Layout";
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
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Layout>
      <Grid>
        <GridItem justifySelf='end' colEnd={13} paddingTop={3} paddingRight={3}>
          <Button colorScheme="blue">Create Category</Button>
        </GridItem>
      </Grid>
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Categories</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>1</Th>
              <Th>Category 1</Th>
              <Th>
                <ButtonGroup gap={2}>
                  <Button colorScheme="blue">Edit</Button>
                  <Button colorScheme="red">Delete</Button>
                </ButtonGroup>
              </Th>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
