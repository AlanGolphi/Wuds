"use client"

import { getAliOssSts } from "@/actions/get-ali-oss-sts"
import { saveFileUrlAction } from "@/actions/save-file-url-action"
import OSS from "ali-oss"
import { useAction } from "next-safe-action/hooks"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"

export default function FileVault() {
  const { execute, result, status } = useAction(saveFileUrlAction)
  const [url, setUrl] = useState<string>("")
  const [userId, setUserId] = useState<string>("cluhtgyjw0000xt3gu5oc8gtj")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number>(0)

  const [store, setStore] = useState<OSS | null>(null)

  const handleUpload = useCallback(
    async (file: File | null) => {
      if (!store || !file || typeof window == undefined) return
      try {
        const result = await store.multipartUpload(
          "test-multi-file/test-img.jpg",
          file,
          {
            parallel: 4,
            partSize: 1024 * 1024,
            progress: function (p, cpt, res) {
              console.log("p: ", p, "cpt: ", cpt, "res: ", res)
              setProgress(p * 100)
            },
          }
        )
        console.log("finish: ", result)
      } catch (e) {
        toast("upload error")
      }
    },
    [store]
  )

  const handleDirectUpload = useCallback(
    (file: File | null) => {
      if (!store || !file) return
      store
        .put("test-upload/test.jpg", file, {
          headers: {
            "x-oss-force-download": "false",
            "Content-Disposition": "inline;",
          },
        })
        .then((result) => {
          console.log(result)
        })
    },
    [store]
  )

  useEffect(() => {
    const fetchAliOssSts = async () => {
      const res = await getAliOssSts()
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

  return (
    <div className="flex flex-col justify-start items-start mb-1">
      <Input
        type="file"
        onChange={(e) => (e.target.files ? setFile(e.target.files[0]) : null)}
      />
      <Button onClick={() => handleUpload(file)}>multiupload file</Button>
      <Button onClick={() => handleDirectUpload(file)}>direct upload</Button>
      <br />
      <Progress value={progress} className="w-14" />
    </div>
  )
}
