import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

const model = new ChatOpenAI({
  openAIApiKey: useRuntimeConfig().openai.API_KEY,
  temperature: 0.8,
  modelName: 'gpt-3.5-turbo',
  maxTokens: 3000,
  streaming: true,
})

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const body = await readBody(event)

  if (body.temperature) {
    model.temperature = body.temperature
  }

  const chatPrompts = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(body.systemMessage.message),
    ...body.formMessage.map((i: { message: string }) =>
      HumanMessagePromptTemplate.fromTemplate(i.message),
    ),
    ...body.context.map((i: { message: string }) =>
      HumanMessagePromptTemplate.fromTemplate(i.message),
    ),
  ])

  const chain = new LLMChain({
    llm: model,
    prompt: chatPrompts,
  })

  const chat = await chain.call({}, [
    {
      handleLLMNewToken(token: string) {
        event.node.res.write(token)
      },
    },
  ])
  return ''
})
