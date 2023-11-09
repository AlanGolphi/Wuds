import { sendText } from "@/apis/webhook"
import { getWeather } from "@/apis/weather"

export async function GET(req: Request, context: { params: { city: string } }) {
  if (!context.params?.city) return Response.json({})
  const weather = await getWeather(context.params.city)
  if (!weather) return Response.json({ code: 500, status: 'nonthing' })
  const currentWeaString = `当前${weather.location.name}天气${weather.now.text}, 温度${weather.now.temperature}°C`
  await sendText(currentWeaString)
  return Response.json({ code: 200, status: 'success' })
}