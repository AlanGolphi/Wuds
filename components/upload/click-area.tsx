"use client"

import { saveImageUrlAction } from "@/actions/save-image-url-action"
import React from "react"
import { Button } from "@/components/ui/button"
import { useAction } from "next-safe-action/hooks"

export default function ClickArea() {
  const { execute, result, status } = useAction(saveImageUrlAction)

  return (
    <div className="flex flex-col justify-start items-start mb-1">
      <div>
        click -&gt;
        <Button
          onClick={() => {
            execute({
              url: `https://${Math.floor(
                Math.random() * 100
              )}example.com${Math.floor(Math.random() * 100)}`,
              userId: "cluhtgyjw0000xt3gu5oc8gtj",
            })
          }}
        >
          nothing
        </Button>
      </div>
      <div>
        {status === "executing" ? (
          "loading..."
        ) : (
          <>
            {status === "hasSucceeded" ? (
              <span className="text-blue-400">
                {result?.data?.url ? result?.data?.url : "loading..."}
              </span>
            ) : null}
            {status === "hasErrored" ? (
              <span className="text-red-400">
                {result?.validationErrors
                  ? JSON.stringify(result.validationErrors)
                  : "loading..."}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
