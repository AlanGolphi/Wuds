import { sendText } from "@/apis/webhook"
import { getWeather } from "@/apis/weather"

export async function GET() {
  const weather = await getWeather('guangzhou')
  const currentWeaString = `当前${weather.location.name}天气${weather.now.text}, 温度${weather.now.temperature}°C`
  await sendText(currentWeaString)
  return Response.json({ code: 200, status: 'success' })
}