import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
  const users = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  console.log("users: ", users)
}

main()
  .then(() => {
    console.log("Seed complete")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
