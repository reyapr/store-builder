import { IProduct } from '@/interfaces'

export interface ISchedule {
  id: string
  date: string
  createdAt: string
  updatedAt: string
  products: {
    productId: string
    scheduleId: string
    product: IProduct.IProductResponse
  }[]
}

export interface IScheduleRespose {
  productId: string
  date: string
}
export interface ICreateScheduleRequest {
  productId: string
  date: string
}
export interface IDeleteScheduleRequest {
  productId: string
  scheduleId: string
}

export interface ISchedulesResponse {
  schedules: ISchedule[]
}
