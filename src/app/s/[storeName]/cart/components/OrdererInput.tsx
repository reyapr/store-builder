/* eslint-disable no-unused-vars */
import React from 'react'

import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'

import { IOrder } from '@/interfaces'

export default function OrdererInput(props: IOrdererInputProps) {
  return (
    <FormControl>
      <FormLabel>Nama:</FormLabel>
      <Input
        name="name"
        value={props.input.name}
        placeholder="Nama"
        marginBottom={2}
        onChange={props.handleChange}
        type="text"
      />

      <FormLabel>Nomor Handphone:</FormLabel>
      <Input
        name="phoneNumber"
        value={props.input.phoneNumber}
        placeholder="No. Handphone"
        marginBottom={2}
        onChange={props.handleChange}
        type="number"
      />

      <FormLabel>Email</FormLabel>
      <Input
        name="email"
        value={props.input.email}
        placeholder="Email"
        marginBottom={2}
        onChange={props.handleChange}
        type="email"
      />

      <FormLabel>Alamat Lengkap/Pengiriman:</FormLabel>
      <Textarea
        name="address"
        value={props.input.address}
        placeholder="Alamat Lengkap/Pengiriman"
        onChange={props.handleChange}
      />
    </FormControl>
  )
}

interface IOrdererInputProps {
  input: IOrder.IOrdererInputForm
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}
