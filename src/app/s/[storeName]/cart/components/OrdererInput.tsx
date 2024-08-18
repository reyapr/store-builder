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
      <FormControl>
        <FormLabel>Nama:</FormLabel>
        <Input
          name="name"
          defaultValue={order.name}
          placeholder="Nama"
          marginBottom={2}
          onChange={onChange}
          type="text"
        />
        <FormErrorMessage>{errors?.name}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Nomor Handphone:</FormLabel>
        <Input
          name="phoneNumber"
          defaultValue={order.phoneNumber}
          placeholder="No. Handphone"
          marginBottom={2}
          onChange={onChange}
          type="number"
        />
        <FormErrorMessage>{errors?.phoneNumber}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          defaultValue={order.email}
          placeholder="Email"
          marginBottom={2}
          onChange={onChange}
          type="email"
        />
        <FormErrorMessage>{errors?.email}</FormErrorMessage>

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
