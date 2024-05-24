import { z } from "zod";

export const menuSchema = z.object({
  name: z.string(),
  description: z.string(),
  recommended: z.boolean().default(false),
});

export const updateMenuSchema = menuSchema.extend({
  id: z.number(),
});

export const menuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number().default(0),
  vegan: z.boolean().default(false),
  seafood: z.boolean().default(false),
});

export const updateMenuItemSchema = menuItemSchema.extend({
  id: z.number(),
});
