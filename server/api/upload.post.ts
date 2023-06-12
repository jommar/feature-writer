import { Weaviate } from '../lib/weaviate'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const fileContent = formData?.find((i) => i.name === 'file')?.data?.toString()
  const className =
    formData?.find((i) => i.name === 'className')?.data?.toString() || ''

  if (!fileContent || fileContent === 'undefined') {
    throw createError({
      statusCode: 400,
      statusMessage: 'File data not found',
    })
  }
  // const className = 'Data'
  const weaviate = new Weaviate()
  const json = weaviate.csvStringToJsonArray(fileContent.replace(/["\r]/gi, ''))
  // const jsonData = json.map((i) => ({ data: JSON.stringify(i) }))
  const classResponse = await weaviate.class.create({
    class: className,
  })
  if (!classResponse) {
    throw createError({
      statusCode: 400,
      statusMessage: `Could not schema for ${className}`,
    })
  }
  const data = await weaviate.insert({
    jsonData: json,
    className,
  })
  const { classes } = await weaviate.class.read()
  return { classes }
})
