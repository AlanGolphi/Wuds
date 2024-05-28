"use server"

import { action } from "./safe-action"
import { saveImageUlrSchema } from "./schemas"
import { db } from "@/lib/db"

export const saveImageUrlAction = action(
  saveImageUlrSchema,
  async ({ url, userId }) => {
    const createData = await db.uploadImage.create({
      data: {
        url,
        userId,
      },
      include: {
        user: true,
      },
    })
    return createData
  }
)
