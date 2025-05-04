import axios from 'axios'
import { HOSTNAME } from './config'
import { useMutation } from '@tanstack/react-query'

export const useReportMutation = () => {
  return useMutation({
    mutationFn: async ({
      restaurantName,
      image,
      isJustMe,
    }: {
      restaurantName: string
      image: string
      isJustMe: boolean
    }) => {
      const response = await axios.post(
        `${HOSTNAME}/api/report/generate`,
        // `${HOSTNAME}/api/report/generate/test/1`,
        {
          restaurantName,
          image,
          isJustMe,
        }
      )
      return response.data
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
