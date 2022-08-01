import { FastifyPluginAsync } from 'fastify'


const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/', async function (request: any, reply: any) {
    reply.send({ root: true })


  })

}

export default root;
