'use client'
import { getCategories } from '@/app/dashboard/categories/actions'
import { Layout } from '@/components'
import { ICategory } from '@/interfaces/category'
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

export default function Categories() {
  const toast = useToast()
  const {
    data: categories,
    isFetching: isFetchingCategories,
    error: errorCategories
  } = getCategories()

  const sortCategories = (a: ICategory, b: ICategory) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Kategori', path: '/dashboard/categories' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetchingCategories}
      error={errorCategories as Error}
      rightHeaderComponent={
        <Button colorScheme="blue" size="sm" onClick={() => {}}>
          Create Category
        </Button>
      }
    >
      {/* <CategoryFormModal
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
              <Th>Store</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories &&
              categories.sort(sortCategories).map((category: ICategory) => {
                return (
                  <Tr key={category.id}>
                    <Th>{category.id}</Th>
                    <Th>{category.name}</Th>
                    <Th>{category.store?.name}</Th>
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
