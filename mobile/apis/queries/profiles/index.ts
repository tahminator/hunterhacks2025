import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../lib/apiFetch";
import { z } from "zod";
import { newProfileSchema } from "@/apis/schema/profile";

export const useProfilesQuery = () => {
  return useQuery({
    queryKey: ["profile", "all"],
    queryFn: async () => {
      const res = await apiFetch("/api/profile/all");
      const data = (await res.json()) as {
        message: string;
      };
    },
  });
};

export const useNewProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      allergies,
    }: z.infer<typeof newProfileSchema>) => {
      const res = await apiFetch("/api/profile/add", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          allergies,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await res.json()) as {
        message: string;
        data: {
          id: string;
          userId: string;
          firstName: string;
          lastName: string;
          profileUrl: string;
          allergies: {
            id: string;
            profileId: string;
            itemName: string;
            severity: "low" | "med" | "high";
          }[];
        };
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", "all"],
      });
    },
  });
};
