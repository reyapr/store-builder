import { IProductOrder } from "@/interfaces/order";
import { toIDRFormat } from "@/utils/idr-format";
import { Modal, ModalOverlay, ModalContent, Table, TableContainer, Tbody, Th, Thead, Tr, Td, ModalBody, ModalHeader, Button, ModalFooter } from "@chakra-ui/react"

export interface IListOfProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productOrders: IProductOrder[];
}

export default function ListOfProductModal(props: IListOfProductModalProps) {
  const { isOpen, onClose, productOrders } = props;
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='full'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Products</ModalHeader>
          <ModalBody>
            <TableContainer>
              <Table variant={"simple"}>
                <Thead>
                  <Tr>
                    <Th>Product ID</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {productOrders.map((productOrder, i) => (
                    <Tr key={i}>
                      <Td>{productOrder.product.id}</Td>
                      <Td>{productOrder.product.name}</Td>
                      <Td>{toIDRFormat(productOrder.product.price)}</Td>
                      <Td>{productOrder.quantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}