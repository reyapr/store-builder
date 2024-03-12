"use client";
import UpdateStatusModal from "@/app/dashboard/orders/components/UpdateStatusModal";
import ListOfProductModal from "@/app/dashboard/orders/components/ListOfProductModal";
import { useGetOrder } from "@/app/dashboard/orders/useGetOrder";
import { useViewProductOrders } from "@/app/dashboard/orders/useViewProductOrders";
import Layout from "@/components/Layout";
import { EOrderStatus, mapOrderStatusToColor } from "@/constants/order";
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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useUpdateOrderStatus } from "@/app/dashboard/orders/useUpdateStatus";

export default function Home() {
  const toast = useToast();
  const { orders, fetchOrders } = useGetOrder(toast);
  const viewProductOrdersHook = useViewProductOrders();
  const updateOrderStatusHook = useUpdateOrderStatus(toast, fetchOrders);
  
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
        isOpen={viewProductOrdersHook.isOpen}
        onClose={viewProductOrdersHook.onClose}
        productOrders={viewProductOrdersHook.productOrders}
      />
      <UpdateStatusModal
        isOpen={updateOrderStatusHook.isOpen}
        onClose={updateOrderStatusHook.onClose}
        statuses={Object.values(EOrderStatus)}
        orderRequest={updateOrderStatusHook.request}
        onSubmit={updateOrderStatusHook.onSubmit}
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
                      onClick={() => viewProductOrdersHook.onOpen(order.products)}
                    >
                      View
                    </Button>
                  </Th>
                  <Th>
                    <Tag colorScheme={mapOrderStatusToColor[order.status]}>
                      {order.status}
                    </Tag>
                  </Th>
                  <Th>
                    <ButtonGroup gap={2}>
                      <Button
                        colorScheme="blue"
                        onClick={() => updateOrderStatusHook.onOpen({ id: order.id, status: order.status })}
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
