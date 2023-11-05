export async function GET() {
  const data = {
    webhookKey: 'here'
  }
  return Response.json({ data })
}