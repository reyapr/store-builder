import React, { useState, useEffect } from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Button,
  ModalFooter,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'

import { mapOrderStatusToColor } from '@/constants/order'
import { IUpdateOrderStatusRequest } from '@/interfaces/order'

export interface IListOfProductModalProps {
  isOpen: boolean
  onClose: () => void
  statuses: string[]
  orderRequest: IUpdateOrderStatusRequest
  // eslint-disable-next-line no-unused-vars
  onSubmit: (request: IUpdateOrderStatusRequest) => void
}

export default function UpdateStatusModal(props: IListOfProductModalProps) {
  const { isOpen, onClose, statuses, orderRequest, onSubmit } = props
  const [status, setStatus] = useState(orderRequest.status)

  useEffect(() => {
    setStatus(orderRequest.status)
  }, [orderRequest.status])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatus(e.target.value)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Status</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Select Status"
                name="storeId"
                value={status}
                onChange={handleChange}
                bg={mapOrderStatusToColor[status]}
                color={status === 'PENDING' ? 'black' : 'white'}
              >
                {statuses.map((status) => {
                  return (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                })}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => onSubmit({ id: orderRequest.id, status })}
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
