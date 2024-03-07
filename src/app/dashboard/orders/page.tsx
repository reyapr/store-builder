"use client";
import ListOfProductModal from "@/app/dashboard/orders/components/ListOfProductModal";
import { useGetOrder } from "@/app/dashboard/orders/useGetOrder";
import { useViewProductOrders } from "@/app/dashboard/orders/useViewProductOrders";
import Layout from "@/components/Layout";
import { EOrderStatus } from "@/constants/order";
import { IProductOrder } from "@/interfaces/order";
import { toIDRFormat } from "@/utils/idr-format";
import { sortByCreatedAt } from "@/utils/sort";
import {
  Button,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Tag,
  ButtonGroup,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

const mapStatusToColor: {[key: string]: string} = {
  [EOrderStatus.PENDING]: "orange",
  [EOrderStatus.COMPLETED]: "green",
  [EOrderStatus.FAILED]: "red",
}

export default function Home() {
  const toast = useToast();
  const { orders, fetchOrders } = useGetOrder(toast);
  const viewProductOrders = useViewProductOrders();
  
  const getTotalQuantity = (items: IProductOrder[]) => {
    return items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }
  
  const getTotalPrice = (items: IProductOrder[]) => {
    return toIDRFormat(items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0))
  }
  
  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <Layout>
      <ListOfProductModal
        isOpen={viewProductOrders.isOpen}
        onClose={viewProductOrders.onClose}
        productOrders={viewProductOrders.productOrders}
      />
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Products</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Store Name</Th>
              <Th>Customer Name</Th>
              <Th>Customer Phone Number</Th>
              <Th>Total Quantity</Th>
              <Th>Price</Th>
              <Th>List of Product</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.sort(sortByCreatedAt).map((order) => {
              return (
                <Tr key={order.id}>
                  <Th>{order.id}</Th>
                  <Th>{order.store.name}</Th>
                  <Th>{order.customer.name}</Th>
                  <Th>{order.customer.phoneNumber}</Th>
                  <Th>{getTotalQuantity(order.products)}</Th>
                  <Th>{getTotalPrice(order.products)}</Th>
                  <Th>
                    <Button
                      colorScheme="cyan"
                      onClick={() => viewProductOrders.onOpen(order.products)}
                    >
                      View
                    </Button>
                  </Th>
                  <Th>
                    <Tag colorScheme={mapStatusToColor[order.status]}>
                      {order.status}
                    </Tag>
                  </Th>
                  <Th>
                    <ButtonGroup gap={2}>
                      <Button
                        colorScheme="blue"
                        onClick={() => {}}
                      >
                        Update Status
                      </Button>
                    </ButtonGroup>
                  </Th>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
