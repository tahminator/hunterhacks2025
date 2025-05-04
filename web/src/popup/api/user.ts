import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
// import { AllergenProfile, Allergy } from '@base/types'
import { HOSTNAME } from './config'

export const useProfilesQuery = () => {
  return useQuery({
    queryKey: ['profile', 'all'],
    queryFn: async () => {
      await axios.get(`${HOSTNAME}/api/profile/all`)
    },
  })
}

// export const useNewProfileMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: async ({ profileName, allergies }: AllergenProfile) => {
//       const res = await axios.post(`${HOSTNAME}/api/profile/add`, {
//         method: 'POST',
//         body: JSON.stringify({
//           profileName,
//           allergies,
//         }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })

//       return (await res.json()) as {
//         message: string
//         data: {
//           id: string
//           userId: string
//           firstName: string
//           lastName: string
//           profileUrl: string
//           allergies: {
//             id: string
//             profileId: string
//             itemName: string
//             severity: 'low' | 'med' | 'high'
//           }[]
//         }
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: ['profile', 'all'],
//       })
//     },
//   })
// }
