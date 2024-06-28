"use client"

import React from "react"
import { getAliOssSts } from "../actions/get-ali-oss-sts"
import OSS from "ali-oss"
import { toast } from "sonner"

export const useGetAliOssStore = () => {
  const [store, setStore] = React.useState<OSS | null>(null)

  React.useEffect(() => {
    const fetchAliOssSts = async () => {
      const res = await getAliOssSts()
      console.log("sts res: ", res)
      if (!res.stsToken) return
      const store = new OSS({
        secure: true,
        region: res.region,
        accessKeyId: res.AccessKeyId,
        accessKeySecret: res.AccessKeySecret,
        bucket: res.bucket,
        stsToken: res.stsToken,
        refreshSTSToken: async () => {
          const res = await getAliOssSts()
          return {
            accessKeyId: res.AccessKeyId,
            accessKeySecret: res.AccessKeySecret,
            stsToken: res.stsToken,
          }
        },
      })
      setStore(store)
    }
    try {
      fetchAliOssSts()
    } catch (e) {
      toast("get sts error")
    }
  }, [])

  return store
}
