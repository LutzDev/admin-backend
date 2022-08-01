// import { getProjectController } from "../controllers/project.controller"
import { getProjectResponse, addProjectResponse } from "../schema/project.schema"



export const getProjectValidation = {
    schema: {
        response: {
            200: getProjectResponse
        }
    }
}

export const addProjectValidation = {
    schema: {
        response: {
            201: addProjectResponse
        }
    }
}

export const deleteProjectValidation = {
    schema: {
        params: {
            id: {
                type: 'string',
                default: 'goodkey',
            }
        }
    }
}


// export const getProjectValidation = {
//     schema: {
//         body: "test",
//         response: {
//             200: getProjectResponse
//         }
//     },
//     handler: getProjectController
// }

