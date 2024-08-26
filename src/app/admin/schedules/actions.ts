/* 
  File ini berisi React custom hooks untuk mengambil data toko menggunakan Axios dan React Query untuk pengambilan dan penyimpanan data.
  - Fungsi getSchedules menggunakan useQuery dari @tanstack/react-query untuk mendapatkan daftar toko dan mengembalikan hasil query.
  - Endpoint pengambilan data sudah diubah menjadi 'api/schedules' sesuai instruksi.
*/

/* eslint-disable react-hooks/rules-of-hooks */
// Menonaktifkan aturan eslint untuk menghilangkan peringatan terkait penggunaan react-hooks

import {
  useQuery,
  useMutation,
  UseQueryResult,
  MutateOptions
} from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

import { ISchedule } from '@/interfaces'


// Fungsi untuk mengambil data schedules menggunakan React Query
export const getSchedules = ( start?: Date, end?: Date): UseQueryResult<ISchedule.ISchedule[], Error> =>
  useQuery<ISchedule.ISchedule[], Error>({
    queryKey: ['schedules'], // Ensure the query key is unique for different dates
    queryFn: async () => {
      const { data } = await axios.get('/api/schedules', { params: { start, end }});
      return data.schedules;
    }
  });

// Fungsi untuk membuat jadwal baru menggunakan useMutation
export const postSchedules = (
  options: MutateOptions<
    ISchedule.ISchedule,
    Error,
    ISchedule.ICreateScheduleRequest
  >
) => {
  return useMutation<
    ISchedule.ISchedule,
    Error,
    ISchedule.ICreateScheduleRequest
  >({
    mutationKey: ['schedules', 'create'],
    mutationFn: async (params: ISchedule.ICreateScheduleRequest) => {
      const response: AxiosResponse<ISchedule.IScheduleResponse, any> =
        await axios.post('/api/schedules', params)
      return response.data.schedule
    },
    ...options
  })
}

// Fungsi untuk menghapus jadwal berdasarkan productId dan scheduleId menggunakan useMutation
export const deleteSchedule = (
  options: MutateOptions<
    ISchedule.IDeleteScheduleResponse,
    Error,
    ISchedule.IDeleteScheduleRequest
  >
) => {
  return useMutation<
    ISchedule.IDeleteScheduleResponse,
    Error,
    ISchedule.IDeleteScheduleRequest
  >({
    mutationKey: ['schedules', 'delete'],
    mutationFn: async (params: ISchedule.IDeleteScheduleRequest) => {
      const response: AxiosResponse<ISchedule.IDeleteScheduleResponse, any> =
        await axios.delete(`/api/schedules`, { data: params })
      return response.data
    },
    ...options
  })
}
