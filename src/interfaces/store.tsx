export interface ICreateStoreRequest {
  name: string
  email: string
}

export interface IUpdateStoreRequest {
  id: string
  name: string
  userId: string
}

export interface ISubmitStoreFormRequest {
  name: string
  id?: string
}

export interface IStore {
  id: string
  name: string
  userId: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IProductScheduleRequest {
  productId: string
  date: string
}
