import { z } from "zod";

export const feedbackSchema = z.object({
  rating: z.number().min(0).max(5),
  message: z.string().default(""),
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
});
