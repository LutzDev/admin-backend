# Admin panel backend
The backend was bootstrapped with [Fastify](https://www.fastify.io/).



## Run project

In the project directory, you can run:

### Development
`npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production
`npm start`

### Docker (Production)
`npm start`


### Test
`npm run test`


## Endpoints
|       HTTP-Method | Endpoint | Description                                                                |
|------------------:|:--------:|----------------------------------------------------------------------------|
|         POST | `/v1/project` | Creates a project and stores it in MongoDB. |
|         GET | `/v1/project` | Fetches all projects from the database. |
|         PUT | `/v1/project/:id` | Updates a project. The project id is passed as identification. |
|         DELETE | `/v1/project/:id` | Deletes a project from the database. This is performed only if no dialog is assigned to this project. The project id is passed as identification.|
|          |  |  |
|          |  |  |
|         POST | `/v1/dialog` | Creates a dialog and stores it in MongoDB. Furthermore, a reference to the dialog is assigned to the project. |
|         PUT | `/v1/dialog` | Updates a dialog. The project id is passed as identification. |
|         DELETE | `/v1/dialog` | Deletes a dialog from the database. The project id is passed as identification. In addition, the reference in the associated project is deleted. |
|          |  |  |
|          |  |  |
|         POST | `/v1/variable` | Creates a variable and stores it in MongoDB. Furthermore, a reference to the variable is assigned to the projects. |
|         GET | `/v1/variable` | Fetches all variables from the database. |
|         PUT | `/v1/variable` | Updates a variable. The project id is passed as identification. |
|         DELETE | `/v1/variable` | Deletes a variable from the database. The project ID is passed as identification. In addition, the reference in the associated project is deleted. |


## Structure
    .
    ├── dist                           # Compiled files
    │ 
    ├── src                            # Source files
    │   ├── plugins                        
    │   │   ├── cors.ts                # enables the use of CORS in a Fastify application.
    │   │   ├── database.ts            # Configuration of MongoDB
    │   │   ├── sensible.ts            # This plugins adds some utilities to handle http errors
    │   │   └── support.ts             # Export decorators to the outer scope
    │   │
    │   ├── routes                     # Routes
    │   │   ├── root.ts                # Test route
    │   │   └── v1                     # Version of api
    │   │       ├── dialog             # Defines the routes for dialogs 
    │   │       ├── project            # Defines the routes for projects  Version 
    │   │       └── variable           # Defines the routes for variables 
    │   │
    │   └── app.ts                     # Loads plugins, routes, ...
    ├── test                           # Automated tests
    └── ...                           