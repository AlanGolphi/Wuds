"use client"
import { saveImageUrlAction } from "@/actions/save-image-url-action"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function FileVault() {
  const { execute, result, status } = useAction(saveImageUrlAction)
  const [url, setUrl] = useState<string>("")
  const [userId, setUserId] = useState<string>("cluhtgyjw0000xt3gu5oc8gtj")
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="flex flex-col justify-start items-start mb-1">
      <Input
        type="file"
        onChange={(e) => (e.target.files ? setFile(e.target.files[0]) : null)}
      />
      <Button onClick={() => console.log("file: ", file)}>console file</Button>
    </div>
  )
}
