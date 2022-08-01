import { FastifyPluginAsync } from "fastify"
const ObjectID = require("mongodb").ObjectID;
import axios from 'axios'

const dialogueCollection = process.env.MONGO_COLL_DIALOGUE ?? 'dialogue'
const projectCollection = process.env.MONGO_COLL_PROJECT ?? 'project'
const transformationUrl = process.env.TRANSFORMATION_URL ?? 'http://127.0.0.1:5040/'
const transformationInky = process.env.TRANSFORMATION_INKY ?? 'transform/inky'


const dialogue: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/:id", async function (request: any, reply: any) {
    try{
      const dialogueColl = this.mongo.db?.collection(dialogueCollection);
      const projectColl = this.mongo.db?.collection(projectCollection);
      const data = request.body;
  
      const resp = await axios({
        method: 'post',
        url: transformationUrl + transformationInky,
        data: data,
      })

      const result = await dialogueColl?.insertOne(resp.data)

      await projectColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        {
          $set: {
            dialogue: result?.insertedId
          }
        },
        { upsert: true }
      );

      reply.send({
        message: `Added dialogue with ID ${result?.insertedId}`
      })
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });

  fastify.put("/:id", async function (request: any, reply: any) {
    try{
      const dialogueColl = this.mongo.db?.collection(dialogueCollection);
      const data = request.body;
      const resp = await axios({
        method: 'post',
        url: transformationUrl + transformationInky,
        data: data,
      })

      const result = await dialogueColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        {
          $set: {
            ... resp.data
          }
        },
        { upsert: true }
      );

      reply.send({
        message: `Updated ${result?.modifiedCount} dialog`
      })
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });

  fastify.delete("/:projectID/:dialogueID", async function (request: any, reply: any) {
    try{
      const dialogueColl = this.mongo.db?.collection(dialogueCollection);
      const projectColl = this.mongo.db?.collection(projectCollection);

      await projectColl?.updateOne(
        { _id: ObjectID(request.params.projectID) },
        {$unset: {dialogue:1}},
        { upsert: true }
      );

       const result = await dialogueColl?.deleteOne({ _id: ObjectID(request.params.dialogueID) });

      reply.send({
        message: `Deleted ${result?.deletedCount} dialog`
      })
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });
}



export default dialogue;
