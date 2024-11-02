import { IProduct, IProductCart } from '@/interfaces/product'
import { IStore } from '@/interfaces/store'

export interface IOrderRequest {
  storeName?: string
  orderer: IOrdererInputForm
  items: IProductCart[]
  totalPrice: number
}

export interface IProductOrder {
  id: number
  quantity: number
  productId: string
  product: {
    id: string
    name: string
    imageUrl: string
    priceBase: number
    price: number
  }
}

export interface IOrder {
  id: string
  total: number
  createdAt: string
  updatedAt: string
  customerId: string
  customer: IOrdererInputForm
  productOrders: IProductOrder[]
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

export interface IProductOrderResponse {
  id: string
  number: number
  total: number
  createdAt: Date
  updatedAt: Date
  customerId: string
  status: string
  storeId: string
  store: IStore
  productOrders: {
    id: string
    quantity: number
    product: IProduct
  }[]
  customer: {
    id: string
    name: string
    phoneNumber: string
    email: string
    address: string
  }
}
