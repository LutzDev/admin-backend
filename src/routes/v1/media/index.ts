import { FastifyPluginAsync } from "fastify"

const media: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return 'this is an example for media'
  })

  fastify.get('/test', async function (request, reply) {
    return 'this is an example for media test'
  })
}

export default media;
