import { IStore } from '@/interfaces/store'

export interface ICreateCategoryRequest {
  name: string
  storeId: string
}

export interface IUpdateCategoryRequest {
  id: string
  name: string
  storeId: string
}

export interface ICategory {
  id: string
  name: string
  storeId: string
  createdAt: string
  updatedAt: string
  store?: IStore
}
