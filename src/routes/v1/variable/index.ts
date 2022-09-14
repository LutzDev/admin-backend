import { FastifyPluginAsync } from "fastify"
const ObjectID = require("mongodb").ObjectID;
import 'dotenv/config'
import { Collection, Document, ObjectId } from "mongodb";

const variablesCollection = process.env.MONGO_COLL_VARIABLES ?? 'variables'
const projectsCollection = process.env.MONGO_COLL_PROJECTS ?? 'projects'

const variable: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get("/", async function (request: any, reply: any) {
    try{
      const variablesColl = this.mongo.db?.collection(variablesCollection);

      const result: Array<Document> = await variablesColl!.aggregate([
        {
          $lookup: {
              from: 'projects',
              localField: '_id',
              foreignField: 'variables',
              as: "projects"
            }
        },
        {
          $project: {
            projects: {
              _id: 1,
              name: 1
            },
            _id: 1,
            key: 1,
            value: 1
          }
        }
      ]).toArray()

      reply.send(result);
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  });

  fastify.post("/:id", async function (request: any, reply: any) {
    try{
      const params = []

      type Project = {
        variable: ObjectId []
      }
      const variablesColl = this.mongo.db?.collection(variablesCollection);
      const projectsColl: Collection<Project> = this.mongo.db!.collection(projectsCollection);
      const variable = request.body;
      const temp_param = request.params.id.split(',')
      for (const param of temp_param){
        params.push(ObjectID(param))
      }
      const result = await variablesColl?.insertOne(variable)
      projectsColl?.updateMany(
        { _id: { $in: params } },
        {
          $push: {
            variables: result?.insertedId
          }
        },
        { upsert: true }
      );
      
      reply.send({
        message: `Added variable with ID ${result?.insertedId}`
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
      const variablesColl = this.mongo.db?.collection(variablesCollection);
      const projectsColl = this.mongo.db?.collection(projectsCollection);      
      
      const result = await variablesColl?.deleteOne({ _id: ObjectID(request.params.id) });

      await projectsColl?.updateMany(
        {},
        {
          $pull: {
            variables: ObjectID(request.params.id)
          }
        }
      )

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


  fastify.put('/:id/:projectID', async function (request: any, reply: any) {
    try{
      const params = []

      type Project = {
        variable: ObjectId []
      }
      const variablesColl = this.mongo.db?.collection(variablesCollection);
      const projectsColl: Collection<Project> = this.mongo.db!.collection(projectsCollection);

      const updateData = {
        $set: {
          ... request.body
        },
      };

      const temp_param = request.params.projectID.split(',')

      for (const param of temp_param){
        params.push(ObjectID(param))
      }
      
      
      await projectsColl?.updateMany(
        {},
        {
          $pull: {
            variables: ObjectID(request.params.id)
          }
        }
      )

      await variablesColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        updateData,
      );

      await projectsColl?.updateMany(
        { _id: { $in: params } },
        {
          $push: {
            variables: ObjectID(request.params.id)
          }
        },
        { upsert: true }
      );
      
      reply.send({
        message: `Update erfolgreich`
      })
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  })
}

export default variable;
