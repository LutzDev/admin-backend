import fp from 'fastify-plugin'
import mongodb, { FastifyMongodbOptions } from '@fastify/mongodb'
import 'dotenv/config'

export default fp<FastifyMongodbOptions>(async (fastify, opts) => {
    fastify.register(mongodb, {
        forceClose: true,        
        url: process.env.MONGO_URL+'/'+process.env.MONGO_DB,
      })
  })