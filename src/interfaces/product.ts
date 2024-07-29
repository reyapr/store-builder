import { ICategory } from '@/interfaces/category'
import { IStore } from '@/interfaces/store'

export interface ICreateProductRequest {
  name: string
  price: number
  stock: number
  storeId: string
  categoryIds: string[]
  description: string
  image: File
}

export interface IProductsResponse {
  products: IProductResponse[]
}

export interface IProductResponse {
  id: string
  name: string
  price: number
  stock: number
  description: string
  imageUrl: string
  storeId: string,
  createdAt: string
  updatedAt: string
}

export interface ICategoryInput {
  label: string
  value: string
}

export interface ICreateProductInput {
  name: string
  price: string
  stock: number
  storeId: string
  categories: ICategoryInput[]
  description: string
  image?: File | null
  imageUrl?: string
}

export interface IProduct {
  id: string
  name: string
  price: number
  stock: number
  store: IStore
  categories: ICategory[]
  description: string
  imageUrl: string
}

export interface IEditProductRequest {
  id: string
  name: string
  price: string
  stock: number
  storeId: string
  categories: ICategoryInput[]
  description: string
  image?: File
  imageUrl?: string
}

export interface IProductCart extends IProduct {
  quantity: number
}
