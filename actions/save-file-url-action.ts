"use server"

import { action } from "./safe-action"
import { saveFileInfoSchema } from "./schemas"
import { db } from "@/lib/db"

export const saveFileUrlAction = action(
  saveFileInfoSchema,
  async ({ id, url, fileType, userId }) => {
    const createData = await db.uploadFile.create({
      data: {
        id,
        url,
        userId,
        fileType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return createData
  }
)
