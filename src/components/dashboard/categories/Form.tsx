import React from 'react'

import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'

import { ICategory, IStore } from '@/interfaces'

export default function Form({
  category,
  stores,
  onChange,
  isLoading = false,
  onSubmit
}: Props) {
  return (
    <>
      <FormControl marginBottom={2}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Category Name"
          value={category.name}
          onChange={onChange}
          name="name"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Store</FormLabel>
        <Select
          placeholder="Select Store"
          value={category.storeId}
          onChange={onChange}
          name="storeId"
        >
          {stores.map((store) => {
            return (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            )
          })}
        </Select>
      </FormControl>
      <FormControl mt={6}>
        <Button
          mr={3}
          w="full"
          isLoading={isLoading}
          colorScheme="blue"
          onClick={onSubmit}
          isDisabled={!category.storeId && !category.name}
        >
          Simpan
        </Button>
      </FormControl>
    </>
  )
}

type InputCategory =
  | ICategory.ICreateCategoryRequest
  | ICategory.IUpdateCategoryRequest
type Props = {
  category: InputCategory
  stores: IStore.IStore[]
  onChange: (
    // eslint-disable-next-line no-unused-vars
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  isLoading?: boolean
  onSubmit: () => void
}
