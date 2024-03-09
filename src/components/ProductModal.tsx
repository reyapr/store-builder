import { ICategoryInput, ICreateProductInput, ICreateProductRequest } from "@/interfaces/product";
import { IStore } from "@/interfaces/store";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Select as MultiSelect, MultiValue } from "chakra-react-select"
import { ICategory } from "@/interfaces/category";

export interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: ICreateProductRequest) => () => void;
  data?: ICreateProductInput,
  stores: IStore[];
  categories: ICategory[];
  title: string;
}

export default function ProductFormModal(props: MyModalProps) {
  const { isOpen, onClose, onSubmit, data } = props;
  
  const [input, setInput] = useState({
    name: '',
    price: '',
    stock: 0,
    storeId: '',
    categories: []
  } as ICreateProductInput);
  
  const unFormatPrice = (price: string) => {
    return parseInt(price.replace(/Rp|\./g, '').replace(',','.'));
  }
  
  const request = {
    ...input, 
    price: unFormatPrice(input.price), 
    categoryIds: input.categories.map(category => category.value)
  } as ICreateProductRequest;
  
  useEffect(() => {
    setInput({
      name: data?.name || '',
      storeId: data?.storeId || '',
      price: data?.price || '',
      stock: data?.stock || 0,
      categories: data?.categories || []
    });
  }, [data?.name]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
      categories: e.target.name === 'storeId' ? [] : input.categories
    });
  }
  
  const handleCategoriesChange = (value: MultiValue<ICategoryInput>) => {
    setInput({
      ...input,
      categories: value as ICategoryInput[]
    });
  }
  
  const handleStockChange = (value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity < 0) return;
    setInput({
      ...input,
      stock: quantity
    });
  }
  
  const categoryOptions = props.categories
    .filter(category => category.storeId === input.storeId)
    .map(category => ({ label: category.name, value: category.id }))
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl marginBottom={2}>
              <FormLabel>Name</FormLabel>
              <Input 
                placeholder="Product Name" 
                value={input.name} 
                onChange={handleChange} 
                name='name'
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
                name='price'
                placeholder="Product Price"
              />
            </FormControl>
            <FormControl marginBottom={2}>
              <FormLabel>Stock</FormLabel>
              <NumberInput 
                value={input.stock} 
                onChange={handleStockChange} 
              >
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
                placeholder='Select Store' 
                value={input.storeId} 
                onChange={handleChange}
                name='storeId'
              >
                {
                  props.stores.map(store => {
                    return <option key={store.id} value={store.id}>{store.name}</option>
                  })
                }
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Categories</FormLabel>
              <MultiSelect
                isMulti
                placeholder='Select Categories'
                onChange={handleCategoriesChange}
                value={input.categories}
                options={categoryOptions}
                isDisabled={!input.storeId}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button isDisabled={!request.storeId} colorScheme="blue" mr={3} onClick={onSubmit(request)}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
