"use server"

import { STS } from "ali-oss"
import z from "zod"
import { getAliOssStsSchema } from "./schemas"

export const getAliOssSts = async (): Promise<
  z.infer<typeof getAliOssStsSchema>
> => {
  const {
    region,
    bucket,
    accessKeyId,
    accessKeySecret,
    roleArn,
    ossAccessPolicy,
  } = {
    region: process.env.ALI_OSS_REGION || "",
    bucket: process.env.ALI_OSS_BUCKET || "",
    accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID || "",
    accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET || "",
    roleArn: process.env.ALI_OSS_ROLE_ARN || "",
    ossAccessPolicy: process.env.ALI_OSS_POLICY || "",
  }
  const client = new STS({
    accessKeyId,
    accessKeySecret,
  })

  const result = await client.assumeRole(
    roleArn,
    ossAccessPolicy,
    3600,
    "aliyun-oss-sts-session"
  )

  return {
    region,
    bucket,
    AccessKeyId: result.credentials.AccessKeyId,
    AccessKeySecret: result.credentials.AccessKeySecret,
    stsToken: result.credentials.SecurityToken,
    Expiration: result.credentials.Expiration,
  }
}
