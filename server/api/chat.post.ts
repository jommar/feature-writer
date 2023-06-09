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
  const bodyMessages = body.form.map(
    (i: { title: any; value: any }) =>
      new HumanChatMessage(`${i.title}: ${i.value}`),
  )

  const messages = [
    new SystemChatMessage(
      `You are a world class business analyst and you will help create tickets on my application. The type of ticket is: ${body.type.toUpperCase()}`,
    ),
    ...bodyMessages,
    new HumanChatMessage(
      'With these information, what should the ticket look like? Be as descriptive as possible, do not leave out any details. Provide the neccessary details that are not covered. Feel free to modify the content to use the best practices.',
    ),
  ]

  if (body.riskAssessment) {
    messages.splice(
      messages.length - 1,
      0,
      new HumanChatMessage('Risk Assessment: '),
    )
  }

  const chat = await model.call(messages)
  return { text: chat.text }
})
