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