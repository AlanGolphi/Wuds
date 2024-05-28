import { z } from "zod"

export const saveImageUlrSchema = z.object({
  url: z.string().url(),
  userId: z.string().cuid(),
})

export const getAliOssStsSchema = z.object({
  region: z.string(),
  bucket: z.string(),
  AccessKeyId: z.string(),
  AccessKeySecret: z.string(),
  stsToken: z.string(),
  Expiration: z.string(),
})
