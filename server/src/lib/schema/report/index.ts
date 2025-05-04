import { severitySchema } from "@/lib/schema/allergies";
import { z } from "zod";

export const reportSchema = z.object({
  name: z.string(),
  foods: z.array(
    z.object({
      title: z.string().trim(),
      description: z.string().trim(),
      severity: severitySchema,
    }),
  ),
});
