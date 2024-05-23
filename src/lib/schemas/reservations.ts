import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  time: z.date(),
  noOfGuests: z.coerce.number().min(1).max(10),
  message: z.string().nullish(),
});

export const editReservationSchema = reservationSchema.extend({
  id: z.number(),
});
