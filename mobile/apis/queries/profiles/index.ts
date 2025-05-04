import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/apiFetch';

export const useProfilesQuery = () => {
  return useQuery({
    queryKey: ["profile", "all"],
    queryFn: async () => {
      const res = await apiFetch("/api/profile/all");
      const data = await res.json() as {
        message: string;
      };
    },
  });
};