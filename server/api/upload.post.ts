import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

const model = new ChatOpenAI({
  openAIApiKey: useRuntimeConfig().openai.API_KEY,
  temperature: 0.8,
  modelName: 'gpt-3.5-turbo',
  maxTokens: 3000,
})

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const fileContent = formData?.find((i) => i.name === 'file')?.data?.toString()
  return { fileContent }
})
