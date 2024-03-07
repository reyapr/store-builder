import { IProductCart } from "@/interfaces/product";

export interface IOrderRequest {
  storeName: string;
  orderer: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  items: IProductCart[];
  totalPrice: number;
}

export interface IProductOrder {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  }
}

export interface IOrders {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  products: IProductOrder[];
  store: {
    name: string;
  },
  status: string;
}