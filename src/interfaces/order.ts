import { IProductCart } from '@/interfaces/product'

export interface IOrderRequest {
  storeName?: string
  orderer: IOrdererInputForm
  items: IProductCart[]
  totalPrice: number
}

export interface IProductOrder {
  id: number
  quantity: number
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
  }
}

export interface IOrder {
  id: string
  total: number
  createdAt: string
  updatedAt: string
  customer: IOrdererInputForm
  products: IProductOrder[]
  store: {
    name: string
  }
  status: string
}

export interface IUpdateOrderStatusRequest {
  id: string
  status: string
}

export interface IUpdateOrderStatusApiRequest {
  status: string
}

export interface IOrdererInputForm {
    name: string
    phoneNumber: string
    email: string
    address: string
}

