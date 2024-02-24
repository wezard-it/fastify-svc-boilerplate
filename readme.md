# Scripts Documentation

This document describes the various scripts included in the `package.json` for the project.

## Available Scripts

-   `dev`: Runs the project in development mode using `ts-node` with environment variables loaded via `dotenv`.
-   `clean`: Removes the `node_modules` directory to clean the project dependencies.
-   `build`: Compiles TypeScript files to JavaScript using the TypeScript compiler.
-   `watch`: Runs the project in development mode with live reloading enabled, using `ts-node-dev`.
-   `lint`: Executes ESLint to identify and report on patterns in TypeScript files within the `src` directory.
-   `lint:fix`: Runs the `lint` script with the `--fix` option to automatically fix linting errors.
-   `start`: Starts the project using Node.js, targeting the compiled JavaScript files in the `dist` directory.
-   `typecheck`: Runs the TypeScript compiler to check types without emitting JavaScript files.
-   `commit`: Facilitates conventional commits using the interactive `git-cz` CLI tool.
-   `prepare`: Sets up Husky for managing Git hooks.
-   `schema`: Executes a custom script (`schemaGenerator.js`) to generate schema-related artifacts. Generates a TypeScript schema from `.types.ts` files in the `src` directory using `typescript-json-schema`, outputting to `_schema.ts`. This final file can be used for validation in `.routes.ts` files
-   `test`: Runs tests using Jest in isolated environments.
-   `plugin`: Executes a custom shell script (`plugin-generator.sh`) for generating boilerplate code for new plugins, including necessary files and directories based on a template. It requires the plugin name in input (eg: user) ang generates files and folder in the `src/plugins` directory

## Plugin Structure

This document outlines the structure of a typical plugin, consisting of several key components that work together to provide functionality. Each file in the plugin has a distinct role:

### `.routes.ts`

Defines the API endpoints, including paths, permissions, authentication requirements, and validation rules. Ensures secure and structured access to the plugin's functionalities.

### `.controller.ts`

Acts as the intermediary between the services and routes. It invokes necessary services, handles errors, and formats the response to ensure consistency and error management.

### `.service.ts`

Responsible for the business logic. It calls various repositories with prepared input data and processes the output, returning "clean" data back to the controller.

### `.repository.ts`

Directly interacts with the database, performing CRUD operations. It abstracts the database layer from the service layer, ensuring separation of concerns.

### `.types.ts`

Contains type declarations for the plugin. It defines interfaces, types, and enums used across the plugin, ensuring type safety and clarity in data handling.

## Hooks

Folder `hooks` contains predefined fastify server hooks to decorate and to enrich fastify Request and Reply:

-   `WezardApiResponse.ts` defines two methods (`success` and `error`) which are appended to FastifyReply object as `wezardSuccess` and `wezardError` in order to standardize success and error responses.
-   `WezardErrorHandler.ts` defines error managment and logging.
-   `WezardReqInitializer.ts` sets the logger for the request and log the initial message
-   `WezardResponseLogger.ts` logs the req final message
-   `authentication.ts` contains authentication functions to use in `.routes.ts` plugin files. Eg: `instance.post('/login', { preHandler: [authFirebase], schema: { body: _schema.LoginBody }  }, authController.login)`. Here you can add different authentication functions (eg: admin, user, internal ecc...)

## Prisma

Prisma for PostgreSQL focuses on defining database schemas and generating Prisma Client through the `npx prisma generate` command. This process bridges the gap between database schemas and application code, enhancing type safety and data access. For in-depth details, refer to the [official Prisma documentation](https://www.prisma.io/docs/orm/reference/prisma-cli-reference).

`prisma` folder contains:

-   `schema.prisma` which is the DB model definition (you can switch from PostgreSQL to mongodb by changing the provider line)
-   `migrations` folder, where will be stored migration after command `npx prisma migrate dev`
-   `dbml` folder, contains a dbml doc of db model (you can paste it on [dbdiagram.io](https://dbdiagram.io/))

Prisma client is then instantiated in `src/utils/db.ts`

## Utils

In `src/utils` folder you can also find:

-   firebase notification util (send notifications given device tokens and notification title and message)
-   storage util (compatible with Google Cloud Storage)
-   mail util (compatible with Sendgrid and MailJet)
-   definition of Wezard Error that is used every time we need to throw an error. You can throw it in two different ways:
    -   `throw WezardError.fromDef(APIErrors.InvalidToken)`, in this case you are using a predefine error of `consts.ts` file
    -   `throw new WezardError("message", 500, "GENERIC_CODE", {"data": "error data"}, previousError, isVisible)`, in this case you are building a new error. Follow documentation in `WezardError.ts` to understand how tu use input parameters.

## Logger (`src/utils/logger.ts`)

The provided logger setup in Node.js using Winston showcases the system's flexibility and extensibility, particularly the ease of integrating various transports for comprehensive logging solutions. This setup is designed to be adaptable to various environments and requirements, from simple console outputs for development to sophisticated logging mechanisms like Logtail and Sentry for production, ensuring effective logging practices across different stages of application deployment.

For a detailed walkthrough and code snippets, please refer to the original content or documentation associated with Winston and the specific transports you are interested in integrating.
