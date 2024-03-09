"use client";
import { useGetCateogries } from "@/app/dashboard/categories/useGetCategory";
import { useGetProducts } from "@/app/dashboard/products/useGetProduct";
import { useCreateProduct } from "@/app/dashboard/products/useCreateProduct";
import { useDeleteProduct } from "@/app/dashboard/products/useDeleteProduct";
import { useUpdateProduct } from "@/app/dashboard/products/useUpdateProduct";
import { useGetStore } from "@/app/dashboard/stores/useGetStore";
import { DeleteAlert } from "@/components/DeleteAlert";
import Layout from "@/components/Layout";
import ProductFormModal from "@/components/ProductModal";
import { toIDRFormat } from "@/utils/idr-format";
import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Image,
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
import { useEffect } from "react";

export default function ProductPage() {  
  const toast = useToast();
  const {stores, fetchStores} = useGetStore(toast);
  const {categories, fetchCategories} = useGetCateogries(toast);
  const {products, fetchProducts} = useGetProducts(toast);
  
  const createProductHook = useCreateProduct(toast, fetchProducts);
  const updateProductHook = useUpdateProduct(toast, fetchProducts);
  const deleteProductHook = useDeleteProduct(toast, fetchProducts);
  
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
      <ProductFormModal
        title="Update product"
        isOpen={updateProductHook.isOpen}
        onClose={updateProductHook.onClose}
        onSubmit={updateProductHook.handleUpdateProduct}
        stores={stores}
        categories={categories}
        data={updateProductHook.currentEditForm}
      />
      <DeleteAlert
        isOpen={deleteProductHook.isOpen}
        onClose={deleteProductHook.onClose}
        onSubmit={deleteProductHook.handleDeleteProduct}
        title="Delete Porudct"
        id={deleteProductHook.targetDeleteProductId}
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
              <Th>Stock</Th>
              <Th>Store</Th>
              <Th>Categories</Th>
              <Th>Image</Th>
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
                  <Th>{product.stock}</Th>
                  <Th>{product.store.name}</Th>
                  <Th>{product.categories.map(category => {
                    return (
                      <Tag key={category.id} colorScheme="blue" marginRight={1}>
                        {category.name}
                      </Tag>
                    )
                  })}</Th>
                  <Th>
                    {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={100} />}
                  </Th>
                  <Th>
                    <ButtonGroup gap={2}>
                      <Button colorScheme="blue" onClick={() => updateProductHook.onOpen(product)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" onClick={() => deleteProductHook.onOpen(product.id)}>
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
