import { z } from "zod";

export const saveImageUlrSchema = z.object({
  url: z.string().url(),
  userId: z.string().cuid(),
});
