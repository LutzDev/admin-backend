import { FastifyPluginAsync } from "fastify"
const ObjectID = require("mongodb").ObjectID;
import 'dotenv/config'

const projectsCollection = process.env.MONGO_COLL_PROJECTS ?? 'projects'

const project: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get("/", async function (request: any, reply: any) {
    try{
      const projectsColl = this.mongo.db?.collection(projectsCollection);
      const result = await projectsColl?.find({}).toArray();
      reply.send(result);
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });

  fastify.post("/", async function (request: any, reply: any) {
    try{
      const projectsColl = this.mongo.db?.collection(projectsCollection);
      const project = request.body;
      const result = await projectsColl?.insertOne(project)
      reply.send({
        message: `Added project with ID ${result?.insertedId}`
      })
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });

  fastify.delete('/:id', async function (request: any, reply: any) {
    try{
      const projectsColl = this.mongo.db?.collection(projectsCollection);
      const result = await projectsColl?.deleteOne({ _id: ObjectID(request.params.id) });
      reply.send({
        message: `Deleted ${result?.deletedCount} project`
      });
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  })


  fastify.put('/:id', async function (request: any, reply: any) {
    try{
      const projectsColl = this.mongo.db?.collection(projectsCollection);
      const updateData = {
        $set: {
          ... request.body
        },
      };
      const result = await projectsColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        updateData,
        { upsert: true }
      );
      reply.send({
        message: `Updated ${result?.modifiedCount} project`
      });
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  })
}

export default project;
