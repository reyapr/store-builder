import { HStack, Button, Input, useNumberInput } from "@chakra-ui/react";

interface INumberInputProps {
  quantity: number;
  productId: string;
  updateProductQuantity: (productId: string, num: number) => void
}

export default function NumberInput(props: INumberInputProps) {
  return (
    <HStack maxW="150px">
      <Button onClick={() => props.updateProductQuantity(props.productId, 1)}>+</Button>
      <Input value={props.quantity} />
      <Button onClick={() => props.updateProductQuantity(props.productId, -1)}>-</Button>
    </HStack>
  )
}