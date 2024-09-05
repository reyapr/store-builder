/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Textarea,
  VStack,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react'
import { Select as MultiSelect, MultiValue } from 'chakra-react-select'
import { useFormik } from 'formik'
import { NumericFormat, NumberFormatValues } from 'react-number-format'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { getCategories } from '@/app/admin/categories/actions'
import { getStores } from '@/app/admin/stores/actions'
import {
  IEditProductRequest,
  IProductResponse,
  ICategoryInput,
  ICreateProductRequest
} from '@/interfaces/product'
import { schema } from '@/utils'
import { uploadToFirebase } from '@/utils/firebase'

export default function ProductForm({
  onCreate,
  onUpdate,
  product,
  isPending = false
}: Props) {
  const [categoryOptions, setCategoryOptions] = useState<ICategoryInput[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    ICategoryInput[]
  >(product.categories.map(({ name, id }) => ({ label: name, value: id })))

  const { data: dataCategories } = getCategories()
  const { data: stores } = getStores()

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues: {
      ...product,
      categoryIds: product.categories.map(({ id }) => id)
    },
    validationSchema: toFormikValidationSchema(schema.adminProductForm),
    onSubmit: (values) => {
      if (onCreate) {
        onCreate(values)
      }
      if (onUpdate) {
        console.log({ values })
        onUpdate(values)
      }
    }
  })

  useEffect(() => {
    if (dataCategories?.length && values.storeId) {
      const options: ICategoryInput[] = dataCategories
        .filter((category) => category.storeId === values.storeId)
        .map((category) => ({ label: category.name, value: category.id }))
      setCategoryOptions(options)
    }
  }, [dataCategories, values])

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <FormControl isInvalid={!!errors.name && touched.name}>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Product Name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.price && touched.price}>
          <FormLabel>Harga dasar</FormLabel>
          <Input
            name="price"
            as={NumericFormat}
            value={values.priceBase}
            onValueChange={(values: NumberFormatValues) => {
              setFieldValue('priceBase', parseFloat(values.value))
            }}
            onBlur={handleBlur}
            prefix="Rp."
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Harga dasar"
          />
          <FormErrorMessage>{errors.price}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.price && touched.price}>
          <FormLabel>Harga jual</FormLabel>
          <Input
            name="price"
            as={NumericFormat}
            value={values.price}
            onValueChange={(values: NumberFormatValues) => {
              setFieldValue('price', parseFloat(values.value))
            }}
            onBlur={handleBlur}
            prefix="Rp."
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Harga Jual"
          />
          <FormErrorMessage>{errors.price}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.stock && touched.stock}>
          <FormLabel>Stock</FormLabel>
          <Input
            name="stock"
            type="number"
            value={values.stock ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Stock"
          />
          <FormHelperText>Kosongkan jika ingin tidak ada stok</FormHelperText>
          <FormErrorMessage>{errors.stock}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.storeId && touched.storeId}>
          <FormLabel>Store</FormLabel>
          <Select
            name="storeId"
            value={values.storeId}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select Store"
          >
            {!!stores?.length &&
              stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{errors.storeId}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.categoryIds && touched.categoryIds}>
          <FormLabel>Categories</FormLabel>
          <MultiSelect
            isMulti
            placeholder="Pilih Categories"
            value={selectedCategories}
            options={categoryOptions}
            onChange={(newValue: MultiValue<ICategoryInput>) => {
              setSelectedCategories(newValue as ICategoryInput[])
              setFieldValue(
                'categoryIds',
                newValue.map((item) => item.value)
              )
            }}
            isDisabled={!values.storeId}
          />
          <FormErrorMessage>{errors.categoryIds}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description && touched.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Product Description"
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Image</FormLabel>
          <Flex>
            {product.imageUrl && (
              <Image src={product.imageUrl} alt="product image" width={150} />
            )}
            <Input
              id="input-file"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFieldValue('image', file)
                }
              }}
            />
          </Flex>
        </FormControl>

        <FormControl mt={6}>
          <Button
            w="full"
            mr={3}
            type="submit"
            isLoading={isPending}
            isDisabled={!values.storeId}
            colorScheme="blue"
          >
            Save
          </Button>
        </FormControl>
      </VStack>
    </form>
  )
}

export interface Props {
  onCreate?: (values: ICreateProductRequest) => void
  onUpdate?: (values: IEditProductRequest) => void
  product: IProductResponse
  title: string
  isPending: boolean
}
