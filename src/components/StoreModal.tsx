import { ISubmitStoreFormRequest } from "@/interfaces/store";
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: ISubmitStoreFormRequest) => () => void;
  data?: {
    name: string;
    id: string;
  },
  title: string;
}

export default function StoreFormModal(props: MyModalProps) {
  const { isOpen, onClose, onSubmit, data } = props;
  
  const [name, setName] = useState(data?.name || '');
  
  useEffect(() => {
    setName(data?.name || '');
  }, [data?.name]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
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
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Store Name" value={name} onChange={handleChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit({ name, id: data?.id })}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
