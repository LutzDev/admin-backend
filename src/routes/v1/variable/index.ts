import { FastifyPluginAsync } from "fastify"
const ObjectID = require("mongodb").ObjectID;
import 'dotenv/config'
import { Collection, Document, ObjectId } from "mongodb";

// import { getProjectValidation, addProjectValidation, deleteProjectValidation } from "../../../valditation/project.validation";
// import { Project } from "../../../models/project.model";

const variablesCollection = process.env.MONGO_COLL_VARIABLES ?? 'variables'
const projectsCollection = process.env.MONGO_COLL_PROJECTS ?? 'projects'

const variable: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get("/", async function (request: any, reply: any) {
    try{
      const variablesColl = this.mongo.db?.collection(variablesCollection);
      // const projectsColl = this.mongo.db?.collection(projectsCollection);
      // const result = await variablesColl?.find({}).toArray();

      const result: Array<Document> = await variablesColl!.aggregate([
        {
          $lookup: {
              from: 'projects',
              localField: '_id',
              foreignField: 'variable',
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
      console.log("=====param=====")
      console.log(request.params.id)
      console.log("==========")
      const temp_param = request.params.id.split(',')
      for (const param of temp_param){
        params.push(ObjectID(param))
      }
      console.log("==========")
      console.log(params)
      console.log("==========")
      const result = await variablesColl?.insertOne(variable)
      projectsColl?.updateMany(
        { _id: { $in: params } },
        {
          $push: {
            variable: result?.insertedId
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

//   fastify.delete('/:id', async function (request: any, reply: any) {
//     try{
//       const projectsColl = this.mongo.db?.collection(projectCollection);
//       const result = await projectsColl?.deleteOne({ _id: ObjectID(request.params.id) });
//       reply.send({
//         message: `Deleted ${result?.deletedCount} project`
//       });
//     } catch (err) {
//       fastify.log.error(err);
//       reply.send({
//         message: `Error message: ${err}`
//       })
//     }
//   })


  fastify.put('/:id', async function (request: any, reply: any) {
    try{
      const variablesColl = this.mongo.db?.collection(variablesCollection);
      const updateData = {
        $set: {
          ... request.body
        },
      };
      const result = await variablesColl?.updateOne(
        { _id: ObjectID(request.params.id) },
        updateData,
        { upsert: true }
      );
      reply.send({
        message: `Updated ${result?.modifiedCount} variable`
      });
    } catch (err) {
      fastify.log.error(err);
      reply.send({
        message: `Error message: ${err}`
      })
    }
  })
}

export default variable;
