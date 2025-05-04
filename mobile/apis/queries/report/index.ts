import { apiFetch } from "@/lib/apiFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGenerateReportMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log(formData);
      const res = await apiFetch("/api/report/generate", {
        method: "POST",
        body: formData,
      });

      console.log(res.ok);

      return (await res.json()) as {
        message: string;
        data: {
          name: string;
          foods: {
            title: string;
            description: string;
            severity: "low" | "med" | "high";
          }[];
        }[];
      };
    },
  });
};
