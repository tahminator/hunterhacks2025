import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../lib/apiFetch";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "@me"],
    queryFn: async () => {
      const res = await apiFetch("/api/auth/@me");
      const data = (await res.json()) as {
        message: string;
        data: {
          user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            profileUrl: string;
            activeProfileId: string;
            activeProfile: {
              id: string;
              userId: string;
              firstName: string;
              lastName: string;
              profileUrl: string;
              allergies: {
                id: string;
                profileId: string;
                itemName: string;
                severity: "low" | "medium" | "high";
              }[];
            };
          };
          session: {
            id: string;
            userId: string;
            expiresAt: string;
          };
        };
      };
      return data;
    },
  });
};
