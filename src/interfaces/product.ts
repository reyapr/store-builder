import { ICategory } from '@/interfaces/category'
import { IStore } from '@/interfaces/store'

export interface ICreateProductRequest {
  name: string
  priceBase: number
  price: number
  stock: number | null
  storeId: string
  categoryIds: string[]
  description: string
  image?: File 
}

export interface IProductsResponse {
  products: IProductResponse[]
}

export interface IProductResponse {
  id: string
  name: string
  priceBase: number
  price: number
  stock: number
  description: string
  imageUrl: string
  image?: File
  storeId: string
  createdAt: string
  updatedAt: string
  store: IStore
  categories: ICategory[]
}

export interface ICategoryInput {
  label: string
  value: string
}

export interface ICreateProductInput {
  name: string
  priceBase: number
  price: number
  stock: number
  storeId: string
  categories: ICategoryInput[]
  description: string
  image?: File | null
  imageUrl?: string
}

export type IProduct = {
  id: string
  name: string
  priceBase: number
  price: number
  stock: number
  store: IStore
  categories: ICategory[]
  description: string
  imageUrl: string
}

export const IProduct = {
  fromData: (product: IProductResponse) => ({
    id: product.id,
    name: product.name,
    priceBase: product.priceBase,
    price: product.price,
    stock: product.stock,
    store: product.store,
    categories: [],
    description: product.description,
    imageUrl: product.imageUrl
  })
}

export interface IEditProductRequest {
  id: string
  name: string
  priceBase: number
  price: number
  stock: number | null
  storeId: string
  categoryIds: string[]
  description: string
  image?: File
  imageUrl?: string
}

export interface IProductCart extends IProduct {
  quantity: number
}
