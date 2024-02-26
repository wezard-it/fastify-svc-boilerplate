# Wezard Fastify Service Boilerplate

This document describes the various scripts included in the `package.json` of the project.

## Available Scripts

-   `dev`: Runs the project in development mode using `ts-node`, with environment variables loaded via `dotenv`.
-   `clean`: Removes the `node_modules` directory to clean up the project dependencies.
-   `build`: Compiles TypeScript files into JavaScript using the TypeScript compiler.
-   `watch`: Runs the project in development mode with live reloading enabled, using `ts-node-dev`.
-   `lint`: Executes ESLint to identify and report on patterns found in TypeScript files within the `src` directory.
-   `lint:fix`: Runs the `lint` script with the `--fix` option to automatically correct linting errors.
-   `start`: Starts the project using Node.js, targeting the compiled JavaScript files in the `dist` directory.
-   `typecheck`: Runs the TypeScript compiler to check types without generating JavaScript files.
-   `commit`: Facilitates conventional commits using the interactive `git-cz` CLI tool.
-   `prepare`: Sets up Husky for managing Git hooks.
-   `test`: Runs tests using Jest in isolated environments.
-   `plugin:generate`: Executes a custom js script (`wezard-scripts/plugin-generator/index.js`) to generate boilerplate code for new plugins, including necessary files and directories based on a template. It requires the plugin name as second paramater (e.g., user) and generates files and folders in the `src/plugins` directory.
-   `schema:generate`: Executes a custom script (`wezard-scripts/schema-generator/index.js`) to generate schema-related artifacts. It generates a TypeScript schema from `.types.ts` files in the `src` directory using `typescript-json-schema`, outputting to `_schema.ts`. This final file can be used for validation in `.routes.ts` files.
-   `prisma:generate`: generate Prisma types

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

The `hooks` folder contains predefined Fastify server hooks to decorate and enrich Fastify Request and Reply objects:

-   `WezardApiResponse.ts` defines two methods (`success` and `error`) which are appended to the FastifyReply object as `wezardSuccess` and `wezardError` to standardize success and error responses. The `success` function is also responsible for outgoing validation given a schema passed as a third parameter.
-   `WezardErrorHandler.ts` defines error management and logging. It handles all responses in case an error occurs.
-   `WezardReqInitializer.ts` sets the logger for the request and logs the initial message.
-   `WezardResponseLogger.ts` logs the final request message.
-   `authentication.ts` contains authentication functions to use in `.routes.ts` plugin files. E.g., `instance.post('/login', { preHandler: [authFirebase], schema: { body: _schema.LoginBody } }, authController.login)`. Here, you can add different authentication functions (e.g., admin, user, internal, etc.).

## Prisma

Prisma for PostgreSQL focuses on defining database schemas and generating Prisma Client through the `npx prisma generate` command. This process bridges the gap between database schemas and application code, enhancing type safety and data access. For in-depth details, refer to the [official Prisma documentation](https://www.prisma.io/docs/orm/reference/prisma-cli-reference).

The `prisma` folder contains:

-   `schema.prisma`, which is the DB model definition (you can switch from PostgreSQL to MongoDB by changing the provider line).
-   The `migrations` folder, where migrations will be stored after the command `npx prisma migrate dev`.
-   The `dbml` folder contains a DBML document of the DB model (you can paste it on [dbdiagram.io](https://dbdiagram.io/)).

The Prisma client is then instantiated in `src/utils/db.ts`.

## Utils

In the `src/utils` folder, you can also

find:

-   Firebase notification utility (sends notifications given device tokens, and notification title and message).
-   Storage utility (compatible with Google Cloud Storage).
-   Mail utility (compatible with SendGrid and MailJet).
-   Definition of Wezard Error, used whenever an error needs to be thrown. You can throw it in two different ways:
    -   `throw WezardError.fromDef(APIErrors.InvalidToken)`, in this case, you are using a predefined error from the `consts.ts` file.
    -   `throw new WezardError("message", 500, "GENERIC_CODE", {"data": "error data"}, previousError, isVisible)`, in this case, you are constructing a new error. Follow the documentation in `WezardError.ts` to understand how to use the input parameters.

## Logger (`src/utils/logger.ts`)

The provided logger setup in Node.js using Winston showcases the system's flexibility and extensibility, particularly in how it integrates various transports for comprehensive logging solutions. This setup is designed to be adaptable to various environments and requirements, from simple console outputs for development to sophisticated logging mechanisms like Logtail and Sentry for production, ensuring effective logging practices across different stages of application deployment.

For a detailed walkthrough and code snippets, please refer to the original content or documentation associated with Winston and the specific transports you are interested in integrating.
