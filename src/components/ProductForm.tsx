import React, { useEffect, useState } from 'react'

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
  VStack
} from '@chakra-ui/react'
import { Select as MultiSelect, MultiValue } from 'chakra-react-select'
import { NumericFormat } from 'react-number-format'

import { getCategories } from '@/app/dashboard/categories/actions'
import { getStores } from '@/app/dashboard/stores/actions'
import { IEditProductRequest, ICategoryInput } from '@/interfaces/product'

export default function ProductFormModal({
  onSubmit,
  product,
  isPending = false
}: Props) {
  const [input, setInput] = useState<IEditProductRequest>(product)
  const [categoryOptions, setCategoryOptions] = useState<ICategoryInput[]>([])

  const { data: categories } = getCategories()
  const { data: stores } = getStores()

  const request = {
    ...input,
    price: input.price,
    categoryIds: input.categoryIds
  } as IEditProductRequest

  const handleChange = (e: React.ChangeEvent<InputElement>): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
      categoryIds: e.target.name === 'storeId' ? [] : input.categoryIds
    })
  }

  const handleCategoriesChange = (
    inputCategories: MultiValue<ICategoryInput>
  ) => {
    setInput({
      ...input,
      categoryIds: inputCategories.map(({ value }) => value)
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

  useEffect(() => {
    if (categories?.length) {
      const options: ICategoryInput[] = categories
        .filter((category) => category.storeId === input.storeId)
        .map((category) => ({ label: category.name, value: category.id }))
      setCategoryOptions(options)
    }
  }, [categories, input.storeId])

  return (
    <VStack gap={3}>
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
          {!!stores?.length &&
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
          value={categoryOptions}
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
          mr={3}
          isLoading={isPending}
          isDisabled={!request.storeId}
          colorScheme="blue"
          onClick={() => onSubmit(request)}
        >
          Simpan
        </Button>
      </FormControl>
    </VStack>
  )
}

export interface Props {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (request: IEditProductRequest) => void
  product: IEditProductRequest
  title: string
  isPending: boolean
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
