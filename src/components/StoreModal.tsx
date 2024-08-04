import React, { useEffect, useState } from 'react'

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
  ModalOverlay
} from '@chakra-ui/react'

import { ISubmitStoreFormRequest } from '@/interfaces/store'

export default function StoreFormModal(props: Props) {
  const { isOpen, onClose, onSubmit, data } = props

  const [name, setName] = useState(data?.name || '')

  useEffect(() => {
    setName(data?.name || '')
  }, [data?.name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Store Name"
                value={name}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => onSubmit({ name, id: data?.id })}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export interface Props {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onSubmit: (request: ISubmitStoreFormRequest) => void
  data?: {
    name: string
    id: string
  }
  title: string
}
