import { sendText } from "@/apis/webhook";
import { getWeather } from "@/apis/weather";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period");
  if (!period) return Response.error()
  if (period === "morning") {
    const weather = await getWeather("guangzhou");
    if (!weather) return Response.json({ code: 500, status: "nonthing" });
    const currentWeaString = `当前${weather.location.name}天气${weather.now.text}, 温度${weather.now.temperature}°C`;
    await sendText(currentWeaString);
    return Response.json({ code: 200, status: "success" });
  }
  if (period === "noon") {
    const result = await sendText("111", true);
    return Response.json({ result });
  }
  return Response.json({code: '200', msg: 'nonthing'})
}
