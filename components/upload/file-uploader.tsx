"use client"

import { useGetAliOssStore } from "@/hooks"
import { cn } from "@/lib/utils"
import { Upload, X, FileUp } from "lucide-react"
import React from "react"
import { useDropzone } from "react-dropzone"
import { nanoid } from "nanoid"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { saveFileUrlAction } from "@/actions/save-file-url-action"

export const FileUploader = () => {
  const store = useGetAliOssStore()
  const [fileList, setFileList] = React.useState<FileItem[]>([])

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFileList((prev: FileItem[]) => [
      ...acceptedFiles.map((file) => ({
        id: nanoid(),
        file,
        progress: 0,
        status: FileItemStatus.READY,
      })),
      ...prev,
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = React.useCallback((id: string) => {
    setFileList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const formatFileName = React.useCallback((fileName: string) => {
    const arr = fileName.split(".")
    return `${arr[0].slice(0, 15)}.${arr[1]}`
  }, [])

  const getFileType = React.useCallback((fileMimeType: string) => {
    if (fileMimeType.includes("image")) {
      return "IMAGE"
    } else if (fileMimeType.includes("video")) {
      return "VIDEO"
    } else {
      return "OTHER"
    }
  }, [])

  const generateFileName = React.useCallback(
    (originalFileName: string, nanoid: string) => {
      const fileType = originalFileName.split(".")[1]
      return `${nanoid}.${fileType}`
    },
    []
  )

  const uploadSingleFileToOss = React.useCallback(
    async (fileItem: FileItem): Promise<UploadOSSResponse> => {
      if (!store || typeof window == undefined) return undefined
      let defaultOssRes: UploadOSSResponse = undefined

      const fileType = getFileType(fileItem.file.type)
      const fileName = generateFileName(fileItem.file.name, fileItem.id)
      const uploadPath = `file-upload/${fileType}/${fileName}`
      await store
        .multipartUpload(uploadPath, fileItem.file, {
          parallel: 4,
          partSize: 1024 * 1024,
          progress: function (p) {
            setFileList((prev) =>
              prev.map((item) =>
                item.id === fileItem.id
                  ? {
                      ...item,
                      progress: p * 100,
                      status: FileItemStatus.UPLOADING,
                    }
                  : item
              )
            )
          },
        })
        .then((res) => {
          setFileList((prev) => prev.filter((item) => item.id !== fileItem.id))

          defaultOssRes = {
            status: "success",
            data: {
              id: fileItem.id,
              url: `https://${res.bucket}.oss-cn-shenzhen.aliyuncs.com/${uploadPath}`,
              fileType,
              userId: "clxyd4q20000a08lda8jw6yzx",
            },
          }
        })
        .catch((e) => {
          defaultOssRes = {
            status: "error",
            data: null,
          }
        })
      return defaultOssRes
    },
    [store]
  )

  const uploadAndSaveToDb = React.useCallback(
    async (fileItem: FileItem) => {
      const ossRes = await uploadSingleFileToOss(fileItem)
      console.log("ossRes: ", ossRes)
      if (!ossRes || ossRes.status !== "success") return
      const dbRes = await saveFileUrlAction(ossRes.data)
      console.log("dbRes: ", dbRes)
    },
    [uploadSingleFileToOss]
  )

  const handleUploadAll = React.useCallback(async () => {
    const filesToUpload = fileList.filter(
      (list) => list.status === FileItemStatus.READY
    )
    await Promise.all(filesToUpload.map(uploadAndSaveToDb))
  }, [fileList])

  return (
    <div className="w-full bg-white border-2 border-white rounded-xl p-4 flex flex-col justify-start items-center">
      <div
        {...getRootProps()}
        className={cn(
          "w-full bg-white border-2 border-white rounded-xl p-4 flex flex-col justify-start items-center transition-colors",
          {
            "border-2 border-dashed border-blue-200": isDragActive,
            "bg-blue-100": isDragActive,
          }
        )}
      >
        <input {...getInputProps()} />
        <Upload
          size={50}
          className={cn(
            "text-slate-500 transition-colors hover:text-blue-400",
            {
              "text-blue-400": isDragActive,
            }
          )}
        />
        <p
          className={cn(
            "mt-2 text-slate-500 transition-colors hover:text-blue-500",
            {
              "text-blue-500": isDragActive,
            }
          )}
        >
          点击/拖拽文件到此处
        </p>
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        {fileList.map((item) => (
          <div
            key={item.id}
            className="w-full flex flex-col justify-start items-center last:border-none"
          >
            <div className="w-full py-2 flex justify-between items-center text-slate-500 last:pb-0">
              {formatFileName(item.file.name)}&nbsp;-&nbsp;
              {`${(item.file.size / 1024 / 1024).toFixed(2)}MB`}
              <div className="flex justify-end items-center">
                {item.status !== FileItemStatus.UPLOADING && (
                  <FileUp
                    onClick={() => {
                      uploadAndSaveToDb(item)
                    }}
                  />
                )}
                <X onClick={() => removeFile(item.id)} />
              </div>
            </div>
            {item.status === FileItemStatus.UPLOADING && (
              <Progress className="h-1" value={item.progress} />
            )}
          </div>
        ))}
      </div>
      {fileList &&
        fileList.some((file) => file.status === FileItemStatus.READY) && (
          <Button
            variant="ghost"
            className="h-5 p-0 mt-4 mb-[-10px] text-slate-500 hover:bg-white"
            onClick={handleUploadAll}
          >
            全部上传
          </Button>
        )}
    </div>
  )
}

type FileUploadData = {
  id: string
  url: string
  fileType: "VIDEO" | "IMAGE" | "OTHER"
  createDate: string
  userId: string
}

enum FileItemStatus {
  READY = "READY",
  UPLOADING = "UPLOADING",
  ERROR = "ERROR",
}

type FileItem = {
  id: string
  file: File
  progress: number
  status: FileItemStatus
}

type OSSUploadSuccessResponse = {
  status: "success"
  data: Omit<FileUploadData, "createDate">
}

type OSSUploadErrorResponse = {
  status: "error"
  data: null
}

type UploadOSSResponse =
  | OSSUploadSuccessResponse
  | OSSUploadErrorResponse
  | undefined

interface FileUploaderProps {
  uploadCallback?: (data: FileUploadData) => void
}
