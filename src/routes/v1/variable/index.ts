import { FastifyPluginAsync } from "fastify"
// const ObjectID = require("mongodb").ObjectID;
import 'dotenv/config'
// import { getProjectValidation, addProjectValidation, deleteProjectValidation } from "../../../valditation/project.validation";
// import { Project } from "../../../models/project.model";

const variableCollection = process.env.MONGO_COLL_VARIABLE ?? 'variable'
// const projectCollection = process.env.MONGO_COLL_PROJECT ?? 'project'

const variable: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get("/", async function (request: any, reply: any) {
    try{
      const variableColl = this.mongo.db?.collection(variableCollection);
      const result = await variableColl?.find({}).toArray();
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
      const variableColl = this.mongo.db?.collection(variableCollection);
       // const projectColl = this.mongo.db?.collection(projectCollection);
      const variable = request.body;
      console.log("==========")
      console.log(request.params.id.split(','))
      console.log("==========")
      // const params: Array<string> = request.params.id.split(',')
      console.log("==========")
      console.log(request.params.id.split(','))
      console.log("==========")
      const result = await variableColl?.insertOne(variable)

      //  await projectColl?.updateOne(
      //     { _id: { $in: ObjectID(params) } },
      //     {
      //       $set: {
      //         variable: result?.insertedId
      //       }
      //     },
      //     { upsert: true }
      //   );

      // var ids = [
      //   ObjectID("62e7d433aa39c5d35fe60282"),
      //   ObjectID("62e7d440aa39c5d35fe60284")
      // ]
      //   await projectColl?.updateMany(
      //     { 
      //       _id: { "$in": ids }
      //     }, 
      //     { $push: { friends: "friend" } },
      //   );

      // await projectColl?.updateOne(
      //   { _id: ObjectID(request.params.id) },
      //   {
      //     $put: {
      //       variable: result?.insertedId
      //     }
      //   },
      //   { upsert: true }
      // );
      
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


//   fastify.put('/:id', async function (request: any, reply: any) {
//     try{
//       const projectsColl = this.mongo.db?.collection(projectCollection);
//       const updateData = {
//         $set: {
//           ... request.body
//         },
//       };
//       const result = await projectsColl?.updateOne(
//         { _id: ObjectID(request.params.id) },
//         updateData,
//         { upsert: true }
//       );
//       reply.send({
//         message: `Updated ${result?.modifiedCount} project`
//       });
//     } catch (err) {
//       fastify.log.error(err);
//       reply.send({
//         message: `Error message: ${err}`
//       })
//     }
//   })
}

export default variable;
