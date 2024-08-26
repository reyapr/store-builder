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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  VStack,
  FormErrorMessage
} from '@chakra-ui/react'
import { Select as MultiSelect, MultiValue } from 'chakra-react-select'
import { Formik, Form, Field, FieldProps } from 'formik'
import { NumericFormat } from 'react-number-format'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { getCategories } from '@/app/admin/categories/actions'
import { getStores } from '@/app/admin/stores/actions'
import {
  IEditProductRequest,
  IProductResponse,
  ICategoryInput
} from '@/interfaces/product'

import { schema } from '@/utils'

export default function ProductForm({
  onSubmit,
  product,
  isPending = false
}: Props) {
  const [categoryOptions, setCategoryOptions] = useState<ICategoryInput[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    ICategoryInput[]
  >(product.categories.map(({ name, id }) => ({ label: name, value: id })))

  const { data: dataCategories } = getCategories()
  const { data: stores } = getStores()

  useEffect(() => {
    if (dataCategories?.length && product.storeId) {
      const options: ICategoryInput[] = dataCategories
        .filter((category) => category.storeId === product.storeId)
        .map((category) => ({ label: category.name, value: category.id }))
      setCategoryOptions(options)
    }
  }, [dataCategories, product.storeId])

  const initialValues: IEditProductRequest = {
    ...product,
    price: String(product.price),
    categoryIds: product.categories.map(({ id }) => id)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(schema.adminProductForm)}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form>
          <VStack gap={3}>
            <Field name="name">
              {({ field }: FieldProps) => (
                <FormControl isInvalid={!!errors.name && touched.name}>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} placeholder="Product Name" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="price">
              {({ field }: FieldProps) => (
                <FormControl isInvalid={!!errors.price && touched.price}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    as={NumericFormat}
                    {...field}
                    prefix="Rp."
                    thousandSeparator="."
                    decimalSeparator=","
                    placeholder="Product Price"
                  />
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="stock">
              {({ field }: FieldProps) => (
                <FormControl isInvalid={!!errors.stock && touched.stock}>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput {...field} min={0}>
                    <NumberInputField placeholder="Product Stock" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.stock}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="storeId">
              {({ field }: FieldProps) => (
                <FormControl isInvalid={!!errors.storeId && touched.storeId}>
                  <FormLabel>Store</FormLabel>
                  <Select {...field} placeholder="Select Store">
                    {!!stores?.length &&
                      stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                  </Select>
                  <FormErrorMessage>{errors.storeId}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="categoryIds">
              {({ field }: FieldProps) => (
                <FormControl
                  isInvalid={!!errors.categoryIds && touched.categoryIds}
                >
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
              )}
            </Field>

            <Field name="description">
              {({ field }: FieldProps) => (
                <FormControl
                  isInvalid={!!errors.description && touched.description}
                >
                  <FormLabel>Description</FormLabel>
                  <Textarea {...field} placeholder="Product Description" />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <Flex>
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt="product image"
                    width={150}
                  />
                )}
                <Input
                  id="input-file"
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
        </Form>
      )}
    </Formik>
  )
}

export interface Props {
  onSubmit: (values: IEditProductRequest) => void
  product: IProductResponse
  title: string
  isPending: boolean
}
