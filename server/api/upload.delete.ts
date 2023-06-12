import { Weaviate } from '../lib/weaviate'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const weaviate = new Weaviate()
  await weaviate.class.delete({ className: body.className })
  return { message: `Class name deleted: ${body.className}` }
})
