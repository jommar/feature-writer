import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
// import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

const model = new ChatOpenAI({
  openAIApiKey: useRuntimeConfig().openai.API_KEY,
  temperature: 0.8,
  modelName: 'gpt-3.5-turbo',
  maxTokens: 3000,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // const messages = [
  //   new SystemChatMessage(body.systemMessage.message),
  //   ...body.formMessage.map(
  //     (i: { message: string }) => new HumanChatMessage(i.message),
  //   ),
  //   ...body.context.map(
  //     (i: { message: string }) => new HumanChatMessage(i.message),
  //   ),
  //   new HumanChatMessage('Format your reply using markdown.'),
  // ]

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

  const chat = await chain.call({})
  return { text: chat.text }
})
