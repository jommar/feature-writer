import { Weaviate } from '../lib/weaviate'

export default defineEventHandler(async (event) => {
  const weaviate = new Weaviate()
  const { classes } = await weaviate.class.read()
  return { classes }
})
