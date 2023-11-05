import { sendText } from "@/apis/webhook"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const textToSend = url.searchParams.get('hey')
  const isToAll = url.searchParams.get('all')
  const result = await sendText(textToSend, isToAll === '1')
  return Response.json({ result })
}