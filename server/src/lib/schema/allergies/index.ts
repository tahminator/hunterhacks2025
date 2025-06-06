import { z } from "zod";

export const severitySchema = z.enum(["low", "med", "high"]);

export const allergiesSchema = z.array(
  z.object({
    itemName: z.string().trim().min(3),
    severity: severitySchema,
  }),
);
