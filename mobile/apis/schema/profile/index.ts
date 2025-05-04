import { z } from "zod";

export const newProfileSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  allergies: allergiesSchema.min(1),
});
