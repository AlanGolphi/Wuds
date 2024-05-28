import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
  const uploadedImgs = await prisma.uploadImage.deleteMany()
  console.log("Deleted users: ", uploadedImgs)
}

main()
  .then(() => {
    console.log("Seed complete")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
