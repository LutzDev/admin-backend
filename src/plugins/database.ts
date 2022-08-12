import fp from 'fastify-plugin'
import mongodb, { FastifyMongodbOptions } from '@fastify/mongodb'
import 'dotenv/config'

export default fp<FastifyMongodbOptions>(async (fastify, opts) => {
    fastify.register(mongodb, {
        forceClose: true,    
        // database: "imtt",    
        url: process.env.MONGO_URL+'/'+process.env.MONGO_DB + "?authSource="+process.env.MONGO_AUTH_SOURCE,
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD,
        }
      })
  })