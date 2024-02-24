import { ICreateCategoryRequest } from "@/interfaces/category";
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
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: ICreateCategoryRequest) => () => void;
  data?: {
    name: string;
    id: string;
    storeId: string;
  },
  stores: IStore[];
  title: string;
}

export default function CategoryFormModal(props: MyModalProps) {
  const { isOpen, onClose, onSubmit, data } = props;
  
  const [input, setInput] = useState({
    name: '',
    storeId: ''
  } as ICreateCategoryRequest);
  
  useEffect(() => {
    setInput({
      name: data?.name || '',
      storeId: data?.storeId || ''
    });
  }, [data?.name]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  }

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
                placeholder="Category Name" 
                value={input.name} 
                onChange={handleChange} 
                name='name'
              />
            </FormControl>
            <FormControl>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit(input)}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
