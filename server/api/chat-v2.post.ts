import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

const model = new ChatOpenAI({
  openAIApiKey: useRuntimeConfig().openai.API_KEY,
  temperature: 0.8,
  modelName: 'gpt-3.5-turbo',
  maxTokens: 3000,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const messages = [
    new SystemChatMessage(body.systemMessage.message),
    ...body.formMessage.map(
      (i: { message: string }) => new HumanChatMessage(i.message),
    ),
    ...body.context.map(
      (i: { message: string }) => new HumanChatMessage(i.message),
    ),
    new HumanChatMessage('Format your reply using markdown.')
  ]

  const chat = await model.call(messages)
  return { text: chat.text }
})
