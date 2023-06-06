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
    new SystemChatMessage(
      `You are a world class business analyst and you will help create tickets for features on my application.`,
    ),
    new HumanChatMessage(`I will be providing you with answers to these steps.
  """
  1. User Role
  2. Goal/Desired Outcome
  3. Context
  4. Functional Requirement
  5. Acceptance Criteria
  6. Non-Functional Requirement
  """`),
    new HumanChatMessage(`
  User Role: ${body.userRole}
  Goal: ${body.goal}
  Context: ${body.context}
  Functional Requirement: ${body.functional}
  Acceptance criteria: ${body.acceptance}
  Non functional requirements: ${body.nonFunctional}
  `),
    new HumanChatMessage(
      'With these information, what should the ticket look like? Be as descriptive as possible, do not leave out any details',
    ),
  ]

  const chat = await model.call(messages)
  return { res: chat.text }
})
