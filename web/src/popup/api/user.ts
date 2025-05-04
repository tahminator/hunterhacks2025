import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
// import { AllergenProfile, Allergy } from '@base/types'
import { HOSTNAME } from './config'
import { Allergy } from '@base/types'

export const useActiveProfileQuery = () => {
  return useQuery({
    queryKey: ['profile', 'active'],
    queryFn: async () => {
      const res = await axios.get(`${HOSTNAME}/api/profile/active`)
      const data = (await res.data) as {
        message: string
        data: {
          firstName: string
          lastName: string
          allergies: Allergy[]
        }
      }
      return data
    },
  })
}

export const useProfilesQuery = () => {
  return useQuery({
    queryKey: ['profile', 'all'],
    queryFn: async () => {
      const res = await axios.get(`${HOSTNAME}/api/profile/all`)
      const data = (await res.data) as {
        message: string
        data: {
          firstName: string
          lastName: string
          allergies: Allergy[]
        }[]
      }
      return data
    },
    select: (data) => {
      console.log(data)
      return {
        data: data.data.map((profile) => ({
          ...profile,
          name: `${profile.firstName} ${profile.lastName}`,
        })),
      }
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
