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
  // streaming: true,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
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

  const chat = await chain.call(
    {},
    // [
    //   {
    //     handleLLMNewToken(token: string) {
    //       console.log(token)
    //     },
    //   },
    // ]
  )
  return { text: chat.text }
})
