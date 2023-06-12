import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema'
import { Weaviate } from '../lib/weaviate'
import { BufferMemory, ChatMessageHistory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

const model = new ChatOpenAI({
  openAIApiKey: useRuntimeConfig().openai.API_KEY,
  temperature: 0.8,
  modelName: 'gpt-3.5-turbo',
  maxTokens: 3000,
})
const pastMessages = [
  new SystemChatMessage(
    'You are an AI assistant with the knowledge of 100 people with 500 IQ. You will provide a long, detailed response. If you not accurately know the answer, you will answer with "I do not know the answer to your question.',
  ),
]
const memory = new BufferMemory({
  chatHistory: new ChatMessageHistory(pastMessages),
})
const chain = new ConversationChain({ llm: model, memory: memory })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const className = 'Data'

  const weaviate = new Weaviate()

  const schema = await weaviate.class.schema({ className })
  const properties = schema?.properties?.map((i: any) => i?.name)

  const searchResult = await weaviate
    .search({
      search: body.prompt,
      className,
      field: properties?.join(' '),
    })
    .then((r) => r.data?.Get?.[className])
  const searchString = JSON.stringify(searchResult?.splice(0, 8)) || ''

  const hasResult = searchString !== '[]'

  // const messages = []
  // messages.push(
  //   new SystemChatMessage(
  //     'You are an AI assistant with the knowledge of 100 people with 500 IQ. You will provide a long, detailed response. If you not accurately know the answer, you will answer with "I do not know the answer to your question.',
  //   ),
  // )
  // if (hasResult) {
  //   messages.push(
  //     new HumanChatMessage(
  //       `Use this data as a guide to help you answer. Just use what is relevant to the my message. """ ${searchString} """`,
  //     ),
  //   )
  // }

  // messages.push(...[new HumanChatMessage(body.prompt)])
  if (hasResult) {
    const dataSummary = await model.call([
      new HumanChatMessage(
        `Modify this data so it only includes items that are relevant to this query\n Data\n""" ${searchString} """\nQuery\n""" ${body.prompt} """\nI want the result to be in a paragraph format so its easier to read.\nIf you cannot do it reply with "Unable to read data"`,
      ),
    ])
    if (!dataSummary.text.match(/Unable to read data/gi)) {
      memory.chatHistory.addUserMessage(
        `** Use this data as a guide to help you answer. Just use what is relevant to the my message. """ ${dataSummary.text} """ **`,
      )
    }
  }

  const response = await chain.call({ input: body.prompt })
  return { text: response, memory: await memory.chatHistory.getMessages() }
})
