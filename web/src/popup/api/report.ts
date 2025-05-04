import axios from 'axios'
import { HOSTNAME } from './config'
import { useMutation } from '@tanstack/react-query'

export const useReportMutation = () => {
  return useMutation({
    mutationFn: async ({
      restaurantName,
      imageBase64,
      isJustMe,
    }: {
      restaurantName: string
      imageBase64: string
      isJustMe: boolean
    }) => {
      const response = await axios.post(
        `${HOSTNAME}/api/report/generateFromURL`,
        {
          imageBase64,
          restaurantName,
          isJustMe,
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
