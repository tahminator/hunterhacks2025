import { apiFetch } from "@/lib/apiFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddAllergyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      allergies,
    }: {
      profileId: string;
      allergies: { itemName: string; severity: "low" | "med" | "high" }[];
    }) => {
      const res = await apiFetch(`/api/profile/${profileId}/allergy/add`, {
        method: "POST",
        body: JSON.stringify(allergies),
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
        queryKey: ["auth", "@me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", "all"],
      });
    },
  });
};
