import { WECHAT_WEBHOOK_HOST } from "./utils";
import { ExcuteStatus } from "./types";
const webhookKey = process.env.WECHAT_WEBHOOK_KEY

export const sendText = async (text?: string | null, all: boolean = false) => {
  if (!text) return
  let result: ExcuteStatus
  const uri = `${WECHAT_WEBHOOK_HOST}?key=${webhookKey}`
  const data = {
    msgtype: 'text',
    text: {
      content: text,
      mentioned_list: all ? ['@all'] : undefined
    }
  }
  try {
    await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      body: JSON.stringify(data)
    })
    result = {
      code: 200,
      msg: 'success'
    }
  } catch {
    result = {
      code: 500,
      msg: 'fail'
    }
  }
  return result
}