// // import { FastifyRequest } from "fastify";

// export const getProjectController =  async function (fastify: any, req: any, reply: any) {
  
//     // await fastify.mongo.db?.collection('users').insertOne({
//     //     name: "hallo",
//     //     age: 26
//     // });
//     reply.send({ hello: 'world' })
// }
// // async function addProject(req: : FastifyRequest<{Params: {id: string};}>, reply: any) {
// //     console.log(req)
// //   reply.send("handler aufgerufen");
// // }


// // const postJoinHandler = async (
// //     request: any,
// //     reply: any
// //   ): Promise<{ id: string; name: string }> => {
// //     try {
// //       const { username, password } = request.body; 
  
// //       const test = await reply.mongo.db.users.insertOne({
// //         username,
// //         password,
// //       });
// //       console.log(test);
  
// //       return reply.code(201).send(username);
// //     } catch (error) {
// //       request.log.error(error);
// //       return reply.send(400);
// //     }
// //   };