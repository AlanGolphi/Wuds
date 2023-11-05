import { sendText } from "@/apis/webhook"

export async function GET() {
  const result = await sendText('111', true)
  return Response.json({ result })
}