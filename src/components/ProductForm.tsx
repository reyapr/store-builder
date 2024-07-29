import {
  ICategoryInput,
  ICreateProductInput,
  ICreateProductRequest
} from '@/interfaces/product'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  useToast
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Select as MultiSelect, MultiValue } from 'chakra-react-select'

import { useGetCateogries } from '@/app/dashboard/categories/useGetCategory'
import { useGetStore } from '@/app/dashboard/stores/useGetStore'

export default function ProductFormModal({
  onSubmit,
  product,
  editMode
}: Props) {
  const toast = useToast()

  const { categories, fetchCategories } = useGetCateogries(toast)
  const { stores, fetchStores } = useGetStore(toast)

  const [input, setInput] = useState(product)

  const unFormatPrice = (price: string) => {
    return parseInt(price.replace(/Rp|\./g, '').replace(',', '.'))
  }

  const request = {
    ...input,
    price: unFormatPrice(input.price),
    categoryIds: input.categories.map((category) => category.value)
  } as ICreateProductRequest

  const handleChange = (e: React.ChangeEvent<InputElement>): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
      categories: e.target.name === 'storeId' ? [] : input.categories
    })
  }

  const handleCategoriesChange = (value: MultiValue<ICategoryInput>) => {
    setInput({
      ...input,
      categories: value as ICategoryInput[]
    })
  }

  const handleStockChange = (value: string) => {
    const quantity = parseInt(value) || 0
    if (quantity < 0) return
    setInput({
      ...input,
      stock: quantity
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInput({
      ...input,
      image: file
    })
  }

  const categoryOptions = categories
    .filter((category) => category.storeId === input.storeId)
    .map((category) => ({ label: category.name, value: category.id }))

  return (
    <>
      <FormControl marginBottom={2}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Product Name"
          value={input.name}
          onChange={handleChange}
          name="name"
        />
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Price</FormLabel>
        <Input
          as={NumericFormat}
          prefix="Rp."
          value={input.price}
          thousandSeparator="."
          decimalSeparator=","
          onChange={handleChange}
          name="price"
          placeholder="Product Price"
        />
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Stock</FormLabel>
        <NumberInput value={input.stock} onChange={handleStockChange}>
          <NumberInputField placeholder="Product Stock" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl marginBottom={2}>
        <FormLabel>Store</FormLabel>
        <Select
          placeholder="Select Store"
          value={input.storeId}
          onChange={handleChange}
          name="storeId"
        >
          {!!stores.length &&
            stores.map((store) => {
              return (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              )
            })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Categories</FormLabel>
        <MultiSelect
          isMulti
          placeholder="Select Categories"
          onChange={handleCategoriesChange}
          value={input.categories}
          options={categoryOptions}
          isDisabled={!input.storeId}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Product Description"
          value={input.description}
          onChange={handleChange}
          name="description"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Image</FormLabel>
        <Flex>
          {product.imageUrl && (
            <Image src={product.imageUrl} alt="product image" width={150} />
          )}
          <Input
            id="input-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Flex>
      </FormControl>
      <FormControl mt={6}>
        <Button
          w="full"
          isDisabled={!request.storeId}
          colorScheme="blue"
          mr={3}
          onClick={onSubmit(request)}
        >
          Simpan
        </Button>
      </FormControl>
    </>
  )
}

export interface Props {
  onSubmit: (request: ICreateProductRequest) => () => void
  product: ICreateProductInput
  title: string
  editMode?: boolean
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
