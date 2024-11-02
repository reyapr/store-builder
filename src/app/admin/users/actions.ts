
import { useQuery, useMutation, MutateOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import axios from 'axios'

import { IUser } from '@/interfaces'

export const useGetUsers = (): UseQueryResult<IUser.IUser[], Error> =>
  useQuery<IUser.IUser[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users')
      return data.users
    }
  })


export const useGetUser = (
  userId: string
): UseQueryResult<IUser.IUser, Error> => {
  return useQuery<IUser.IUser, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`)
      return data.user
    },
    enabled: !!userId // Only run the query if userId is provided
  })
}

export const useCreateUser = (options: MutateOptions<
  IUser.IUser,
  Error,
  IUser.ICreateUserRequest
>): UseMutationResult<
  IUser.IUser,
  Error,
  IUser.ICreateUserRequest
> =>
  useMutation<IUser.IUser, Error, IUser.ICreateUserRequest>({
    mutationKey: ['api', 'users', 'create'],
    mutationFn: async (request: IUser.ICreateUserRequest) => {
      const { data } = await axios.post('/api/users', request)
      return data.user
    },
    ...options
  })

