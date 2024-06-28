import { z } from "zod"

export const saveFileInfoSchema = z.object({
  id: z.string().nanoid(),
  url: z.string().url(),
  userId: z.string().cuid(),
  fileType: z.enum(["VIDEO", "IMAGE", "OTHER"]),
})

export const getAliOssStsSchema = z.object({
  region: z.string(),
  bucket: z.string(),
  AccessKeyId: z.string(),
  AccessKeySecret: z.string(),
  stsToken: z.string(),
  Expiration: z.string(),
})
