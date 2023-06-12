import { ObjectsBatcher, default as weaviate } from 'weaviate-ts-client'

interface ObjProperties {
  [key: string]: any
}

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
  headers: { 'X-OpenAI-Api-Key': useRuntimeConfig().openai.API_KEY },
})

export class Weaviate {
  client = client
  csvStringToJsonArray(csvString: string) {
    const lines = csvString.split('\n') // split the csv into lines
    const headers = lines[0].split(',') // split the first line to get the headers
    const json = [] // will contain the resulting json

    for (let i = 1; i < lines.length; i++) {
      // iterate over each line
      const obj: any = {} // an object to hold the data for a row
      const currentline = lines[i].split(',') // split the line into fields

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] // map the data to the headers
      }

      json.push(obj) // add the object to the json array
    }

    return json // return the json array
  }
  class = {
    toDataType({ val }: { val: any }) {
      return 'text'
    },
    arrayToSchema({ array }: { array: string[] }) {
      const obj: any = {}
      for (const o of Object.entries(array[0])) {
        obj[o[0]] = this.toDataType({ val: o[1] })
      }
      return obj
    },
    async create(opts: any) {
      const classes = await this.read().then((r) => r.classes)
      const found = classes.find((i: any) => i.class === opts.class)
      if (found) {
        return found
      }
      const response = await client.schema
        .classCreator()
        .withClass({
          ...opts,
          vectorizer: 'text2vec-openai',
        })
        .do()
        .then((r) => r)
        .catch((e) => e)

      return response
    },
    async schema({ className }: { className: string }) {
      const response = await client.schema
        .classGetter()
        .withClassName(className)
        .do()
        .then((r) => r)
        .catch((e) => e)

      return response
    },
    async read() {
      const response = await client.schema
        .getter()
        .do()
        .then((r) => r)
        .catch((e) => e)

      return response
    },
    async delete({ className }: { className: any }) {
      const response = await client.schema
        .classDeleter()
        .withClassName(className)
        .do()
        .then((r) => r)
        .catch((e) => e)

      return await this.read()
    },
  }
  async search({
    search,
    className,
    field = 'data',
  }: {
    search: string
    className: string
    field?: string
  }) {
    const response = await client.graphql
      .get()
      .withClassName(className)
      .withNearText({ concepts: [search], certainty: 0.89 }) // Schema is required to search for withNearText
      //   .withFields(`${field} _additional {certainty}`)
      .withFields(`${field}`)
      .do()
      .then((r) => r)
      .catch((e) => e)

    return response
  }
  async getObjects({
    className,
    afterUuid = '',
  }: {
    className: string
    afterUuid?: string
  }) {
    const response = await client.data
      .getter()
      .withClassName(className)
      .withLimit(100)
      .withAfter(afterUuid)
      .do()
      .then((r) => r)
      .catch((e) => e)

    return response
  }
  async insert({
    jsonData,
    className,
  }: {
    jsonData: object[]
    className: string
  }) {
    let batcher: ObjectsBatcher = client.batch.objectsBatcher()
    let counter: number = 0
    let batchSize: number = 10
    const dataObj = jsonData.map((i) => {
      const entries = Object.entries(i)
      const obj: ObjProperties = {
        class: className,
        properties: {},
      }
      for (const e of entries) {
        obj.properties[e[0]] = e[1]
      }

      return obj
    })
    const batches = []
    while (dataObj.length) {
      batches.push(dataObj.splice(0, batchSize))
    }
    const promises = []
    for (const b of batches) {
      for (const obj of b) {
        batcher.withObject(obj)
      }
      promises.push(
        batcher
          .do()
          .then((r) => r)
          .catch((e) => e),
      )
      batcher = client.batch.objectsBatcher()
    }
    const response = await Promise.all(promises)
      .then((r) => r)
      .catch((e) => e)

    return response

    // return await this.getObjects({ className })
  }
}
