import { FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useState } from "react";

interface IOrdererInputProps {
  input: {
    name: string;
    phone: string;
    address: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

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
      />

      <FormLabel>Nomor Handphone:</FormLabel>
      <Input
        name="phone"
        value={props.input.phone}
        placeholder="No. Handphone"
        marginBottom={2}
        onChange={props.handleChange}
      />

      <FormLabel>Alamat Lengkap/Pengiriman:</FormLabel>
      <Textarea
        name="address"
        value={props.input.address}
        placeholder="Alamat Lengkap/Pengiriman"
        onChange={props.handleChange}
      />
    </FormControl>
  );
}
