import axios from 'axios'
import { HOSTNAME } from './config'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await axios.post(`${HOSTNAME}/api/auth/guest`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', '@me'] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await axios.post(`${HOSTNAME}/api/auth/logout`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', '@me'] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ['auth', '@me'],
    retry: false,
    queryFn: async () => {
      const res = await axios.get(`${HOSTNAME}/api/auth/@me`)

      const data = (await res.data) as {
        message: string
        data: {
          user:
            | {
                id: string
                username: string
                firstName: string
                lastName: string
                email: string
                profileUrl: string
                activeProfileId: string
                activeProfile: {
                  id: string
                  userId: string
                  firstName: string
                  lastName: string
                  profileUrl: string
                  allergies: {
                    id: string
                    profileId: string
                    itemName: string
                    severity: 'low' | 'medium' | 'high'
                  }[]
                }
              }
            | undefined
          session:
            | {
                id: string
                userId: string
                expiresAt: string
              }
            | undefined
        }
      }
      return data
    },
  })
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => {
      const response = await axios.post(`${HOSTNAME}/api/auth/login`, {
        username,
        password,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', '@me'] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      username,
      email,
      password,
      firstName,
      lastName,
    }: {
      username: string
      email: string
      password: string
      firstName: string
      lastName: string
    }) => {
      const response = await axios.post(`${HOSTNAME}/api/auth/register`, {
        username,
        email,
        password,
        firstName,
        lastName,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', '@me'] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
