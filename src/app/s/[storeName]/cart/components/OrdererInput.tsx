/* eslint-disable no-unused-vars */
import React from 'react'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea
} from '@chakra-ui/react'
import { FormikErrors } from 'formik'

import { IOrder } from '@/interfaces'

export default function OrdererInput({
  order,
  onChange,
  errors
}: IOrdererInputProps) {
  return (
    <>
      <FormControl isInvalid={!!errors?.name} mb={5}>
        <FormLabel>Nama:</FormLabel>
        <Input
          name="name"
          defaultValue={order.name}
          placeholder="Nama"
          onChange={onChange}
          type="text"
        />
        <FormErrorMessage>{errors?.name}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.phoneNumber} mb={5}>
        <FormLabel>Nomor Handphone:</FormLabel>
        <Input
          name="phoneNumber"
          defaultValue={order.phoneNumber}
          placeholder="No. Handphone"
          onChange={onChange}
          type="number"
        />
        <FormErrorMessage>{errors?.phoneNumber}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.email} mb={5}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          defaultValue={order.email}
          placeholder="Email"
          onChange={onChange}
          type="email"
        />
        <FormErrorMessage>{errors?.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.email} mb={5}>
        <FormLabel>Alamat Lengkap/Pengiriman:</FormLabel>
        <Textarea
          name="address"
          defaultValue={order.address}
          placeholder="Alamat Lengkap/Pengiriman"
          onChange={onChange}
        />
      </FormControl>
    </>
  )
}

interface IOrdererInputProps {
  order: IOrder.IOrdererInputForm
  errors: FormikErrors<IOrder.IOrdererInputForm>
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}
