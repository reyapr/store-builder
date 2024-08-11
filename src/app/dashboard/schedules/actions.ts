/* 
  File ini berisi React custom hooks untuk mengambil data toko menggunakan Axios dan React Query untuk pengambilan dan penyimpanan data.
  - Fungsi getSchedules menggunakan useQuery dari @tanstack/react-query untuk mendapatkan daftar toko dan mengembalikan hasil query.
  - Endpoint pengambilan data sudah diubah menjadi 'api/schedules' sesuai instruksi.
*/

/* eslint-disable react-hooks/rules-of-hooks */
// Menonaktifkan aturan eslint untuk menghilangkan peringatan terkait penggunaan react-hooks

import { useQuery, useMutation, UseQueryResult, MutateOptions } from '@tanstack/react-query'
import axios from 'axios'

import { ISchedule } from '@/interfaces'


// Fungsi untuk mengambil data schedules menggunakan React Query
export const getSchedules = (): UseQueryResult<ISchedule.ISchedule[], Error> =>
  useQuery<ISchedule.ISchedule[], Error>({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data } = await axios.get('/api/schedules') 
      return data.schedules
    }
  })

// Fungsi untuk membuat jadwal baru menggunakan useMutation
export const postSchedules = (options: MutateOptions<ISchedule.ISchedule, Error, ISchedule.ICreateScheduleRequest>) => {
  return useMutation<ISchedule.ISchedule, Error, ISchedule.ICreateScheduleRequest>({
    mutationKey: ['schedules', 'create'],
    mutationFn: async (params: ISchedule.ICreateScheduleRequest ) => {
      return axios.post('/api/schedules', params)
    },
    ...options
  })
}

// Fungsi untuk menghapus jadwal berdasarkan productId dan scheduleId menggunakan useMutation
export const deleteSchedule = (params: ISchedule.IDeleteScheduleRequest) => {
  return useMutation({
    mutationKey: ['schedules', 'delete'],
    mutationFn: async () => {
      return axios.delete(`/api/schedules`, { data: params })
    }
  })
}
