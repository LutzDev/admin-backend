import { FastifyPluginAsync } from "fastify"
const ObjectID = require("mongodb").ObjectID;
import axios from 'axios'

const dialogsCollection = process.env.MONGO_COLL_DIALOGS ?? 'dialogs'
const projectsCollection = process.env.MONGO_COLL_PROJECTS ?? 'projects'
const transformationUrl = process.env.TRANSFORMATION_URL ?? 'http://127.0.0.1:5040/'
const transformationInky = process.env.TRANSFORMATION_INKY ?? 'transform/inky'


const dialog: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/:id", async function (request: any, reply: any) {
    try{
      const dialogsColl = this.mongo.db?.collection(dialogsCollection);
      const projectsColl = this.mongo.db?.collection(projectsCollection);
      const data = request.body;
  
      const resp = await axios({
        method: 'post',
        url: transformationUrl + transformationInky,
        data: data,
      })

      const result = await dialogsColl?.insertOne(resp.data)

      await projectsColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        {
          $set: {
            dialog: result?.insertedId
          }
        },
        { upsert: true }
      );

      reply.send({
        message: `Added dialog with ID ${result?.insertedId}`
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
      const dialogsColl = this.mongo.db?.collection(dialogsCollection);
      const data = request.body;
      const resp = await axios({
        method: 'post',
        url: transformationUrl + transformationInky,
        data: data,
      })

      const result = await dialogsColl?.updateOne(
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

  fastify.delete("/:projectID/:dialogID", async function (request: any, reply: any) {
    try{
      const dialogsColl = this.mongo.db?.collection(dialogsCollection);
      const projectsColl = this.mongo.db?.collection(projectsCollection);

      await projectsColl?.updateOne(
        { _id: ObjectID(request.params.projectID) },
        {$unset: {dialog:1}},
        { upsert: true }
      );

      const result = await dialogsColl?.deleteOne({ _id: ObjectID(request.params.dialogID) });

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



export default dialog;
