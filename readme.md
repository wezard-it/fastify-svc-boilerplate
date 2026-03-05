# Wezard Fastify Service Boilerplate

This document describes the various scripts included in the `package.json` of the project.

## Available Scripts

- `dev`: Runs the project in development mode using `ts-node`, with environment variables loaded via `dotenv`.
- `clean`: Removes the `node_modules` directory to clean up the project dependencies.
- `build`: Compiles TypeScript files into JavaScript using the TypeScript compiler.
- `watch`: Runs the project in development mode with live reloading enabled, using `ts-node-dev`.
- `lint`: Executes ESLint to identify and report on patterns found in TypeScript files within the `src` directory.
- `lint:fix`: Runs the `lint` script with the `--fix` option to automatically correct linting errors.
- `start`: Starts the project using Node.js, targeting the compiled JavaScript files in the `dist` directory.
- `typecheck`: Runs the TypeScript compiler to check types without generating JavaScript files.
- `commit`: Facilitates conventional commits using the interactive `git-cz` CLI tool.
- `prepare`: Sets up Husky for managing Git hooks.
- `test`: Runs tests using Jest in isolated environments.
- `plugin:generate`: Executes a custom js script (`wezard-scripts/plugin-generator/index.js`) to generate boilerplate code for new plugins, including necessary files and directories based on a template. It requires the plugin name as second paramater (e.g., user) and generates files and folders in the `src/plugins` directory.
- `schema:generate`: Executes a custom script (`wezard-scripts/schema-generator/index.js`) to generate schema-related artifacts. It generates a TypeScript schema from `.types.ts` files in the `src` directory using `typescript-json-schema`, outputting to `_schema.ts`. This final file can be used for validation in `.routes.ts` files. For typescript annotations see [this doc](https://github.com/YousefED/typescript-json-schema/blob/master/api.md)
- `prisma:generate`: generate Prisma types
- `terraform:init:staging`: init Terraform staging configuration
- `terraform:init:prod`: init Terraform prod configuration
- `terraform:apply:staging`: apply Terraform staging configuration
- `terraform:apply:prod`: apply Terraform prod configuration

---

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

- `WezardApiResponse.ts` defines two methods (`success` and `error`) which are appended to the FastifyReply object as `wezardSuccess` and `wezardError` to standardize success and error responses. The `success` function is also responsible for outgoing validation given a schema passed as a third parameter.
- `WezardErrorHandler.ts` defines error management and logging. It handles all responses in case an error occurs.
- `WezardReqInitializer.ts` sets the logger for the request and logs the initial message.
- `WezardResponseLogger.ts` logs the final request message.
- `authentication` folder contains authentication functions to use in `.routes.ts` plugin files. E.g., `instance.post('/login', { preHandler: [authToken], schema: { body: _schema.LoginBody } }, authController.login)`. Here you can define different kind of authentication (eg: authToken) and for each of them define their implementation (eg: `firebase-auth.ts`)

---

## Prisma

Prisma for PostgreSQL focuses on defining database schemas and generating Prisma Client through the `npx prisma generate` command. This process bridges the gap between database schemas and application code, enhancing type safety and data access. For in-depth details, refer to the [official Prisma documentation](https://www.prisma.io/docs/orm/reference/prisma-cli-reference).

The `prisma` folder contains:

- `schema.prisma`, which is the DB model definition (you can switch from PostgreSQL to MongoDB by changing the provider line).
- The `migrations` folder, where migrations will be stored after the command `npx prisma migrate dev`.
- The `dbml` folder contains a DBML document of the DB model (you can paste it on [dbdiagram.io](https://dbdiagram.io/)).

The Prisma client is then instantiated in `src/utils/db.ts`.

---

## Utils

In the `src/utils` folder, you can also

find:

- Firebase notification utility (sends notifications given device tokens, and notification title and message).
- Storage utility (standard implementation is with Google Cloud Storage).
- Mail utility (standard implementations are with SendGrid and MailJet).
- Definition of Wezard Error, used whenever an error needs to be thrown. You can throw it in two different ways:
    - `throw WezardError.fromDef(APIErrors.InvalidToken)`, in this case, you are using a predefined error from the `consts.ts` file.
    - `throw new WezardError("message", 500, "GENERIC_CODE", {"data": "error data"}, previousError, isVisible)`, in this case, you are constructing a new error. Follow the documentation in `WezardError.ts` to understand how to use the input parameters.

---

## Logger (`src/utils/logger.ts`)

The provided logger setup in Node.js using Winston showcases the system's flexibility and extensibility, particularly in how it integrates various transports for comprehensive logging solutions. This setup is designed to be adaptable to various environments and requirements, from simple console outputs for development to sophisticated logging mechanisms like Logtail and Sentry for production, ensuring effective logging practices across different stages of application deployment.

For a detailed walkthrough and code snippets, please refer to the original content or documentation associated with Winston and the specific transports you are interested in integrating.

---

## Terraform

### Files

#### 1. `main.tf`

This file defines the main configuration for the Google Cloud infrastructure required by the Fastify service. It includes:

- **Google Cloud Provider**: Specifies the GCP project and region.
- **API Enabling**: Activates the necessary APIs to manage resources like Cloud Run, Cloud SQL, Artifact Registry, and IAM.
- **GitHub Actions Service Account**: Creates a service account that is used to deploy from GitHub Actions with the following roles:
    - `roles/artifactregistry.admin`
    - `roles/iam.serviceAccountUser`
    - `roles/run.admin`
- **Cloud SQL (PostgreSQL 16)**: Creates and configures a Cloud SQL instance running PostgreSQL 16.
- **Artifact Registry**: Creates a Docker repository to host the Docker images used by the service.
- **Cloud Run**: Defines the Cloud Run service, including environment variables, CPU and memory configurations, and autoscaling.
- **IAM Binding**: Grants necessary permissions to the service account for deploying on Cloud Run.
- **Outputs**: Returns key information like the Cloud Run URL and the service account key in JSON format.

#### 2. `variables.tf`

This file defines all the variables needed to configure the infrastructure. Each variable can be overridden by a `.tfvars` file specific to the environment (e.g., `staging.tfvars`).

Key variables include:

- `project_id`: The GCP project ID.
- `service_name`: The name of the Cloud Run service.
- `db_instance_name`: The name of the Cloud SQL (PostgreSQL) instance.
- `db_name`, `db_user`, `db_pwd`: Database configurations.
- `min_instances`, `max_instances`: Parameters for the minimum and maximum number of Cloud Run instances.
- `cpu_limit`, `memory_limit`: Resource limits for Cloud Run.
- `bucket_name`: The name of the Cloud Storage bucket.
- `github_sa_name`: The name of the service account used by GitHub Actions.
- `tmp_image_enabled`: A boolean that determines whether to use a temporary image for the initial deployment when the Docker image is not yet available in the Artifact Registry. This is useful during the first deployment to avoid failures if the target image has not been pushed yet. If `true`, it allows the use of a placeholder image until the final image is available.

#### 3. `staging.tfvars`

This file contains variable values specific to the **staging** environment. It allows you to quickly configure the infrastructure for a specific environment.

Example variables in the file:

```hcl
project_id = "app-wezard"
service_name = "wezard-svc-staging"
db_instance_name = "wezard-staging"
db_name = "staging"
db_user = "staging"
db_pwd = "AAAAAA"
min_instances = "0"
max_instances = "1"
cpu_limit = "1"
memory_limit = "256Mi"
bucket_name = "wezard-staging"
github_sa_name = "github-actions-sa"
tmp_image_enabled = true
```

These variables are loaded when running Terraform with the `-var-file="staging.tfvars"` flag.

#### 4. `outputs.tf`

This file defines the **outputs** that Terraform will return after running the deployment:

- **Cloud Run URL**: The public URL of the Cloud Run service.
- **Database Connection String**: The connection string to the Cloud SQL PostgreSQL database.
- **Artifact Registry URL**: The Docker repository URL for deployment.
- **Service Account Key**: The service account key in BASE64 format, to be used for configuring GitHub Actions.

---

### How to Use Terraform

#### 1. Initialize Terraform

First, initialize the Terraform project for the **staging** environment:

```bash
yarn terraform:init:staging
```

For **production**, use:

```bash
yarn terraform:init:prod
```

#### 2. Apply the Configuration

To apply the configuration and create the resources on GCP for **staging**:

```bash
yarn terraform:apply:staging
```

For **production**, use:

```bash
yarn terraform:apply:prod
```

#### 3. Managing Environment Variables

You can define environment variables in the `.tfvars` file or in the `variables.tf`. These variables will be automatically passed to the Fastify service when deploying on Cloud Run.

#### `tmp_image_enabled` usage

The variable `tmp_image_enabled` is a **boolean flag** that controls whether a temporary placeholder image should be used for Cloud Run when the target Docker image is not yet available in the Artifact Registry.

##### Where It Is Used in the Code:

This flag is primarily used during the initial deployment to avoid failures when the Docker image that should be deployed hasn't been pushed to the Artifact Registry yet. If this is set to `true`, a temporary Docker image (like `nginx` or `hello-world`) is used in place of the final image until it is available.

In the Terraform code, you can find this variable being checked and used to determine which Docker image to use for the Cloud Run service.

## Bruno APIs

### Implementation

The Bruno collections are stored under the `bruno` folder and mirror the example Fastify plugins:

- `bruno/Auth/*.bru` calls the `Auth` routes (for example the `/register` endpoint).
- `bruno/User/*.bru` calls the `User` routes (for example the `GET /users/:userId` endpoint).
- `bruno/Health/*.bru` and `bruno/Docs/*.bru` target the health check and OpenAPI documentation routes.
- `bruno/environments/local.bru` defines shared variables such as `baseUrl`, `apiVersion` and `token`.

The collection is generated from the OpenAPI document using the `yarn bruno:generate` script, keeping the requests in sync with the documented API.

### How to use

1. Install the Bruno CLI and make sure the service is running locally.
2. Edit `bruno/environments/local.bru` if needed to point `baseUrl` to your local URL and set `token` when testing authenticated routes.
3. Open the `bruno` folder in the Bruno app, or run requests from the CLI, for example:
    - Run all checks against the local environment from inside the `bruno` directory:
        - `bru run --env local`
    - Run or tweak the single `Auth` / `User` requests to manually exercise the example endpoints.

---

## Tests

### Implementation

The test suite is built with Jest and split into unit and integration layers:

- **Unit tests** live under `tests/unit`:
    - `auth.service.test.ts` covers `authService.register`, mocking `users.service`.
    - `users.service.test.ts` covers `usersService` while mocking the underlying repository.
- **Integration tests** live under `tests/integration` and are meant to exercise Fastify endpoints end‑to‑end (see `example.test.ts` as a template).
- Shared test utilities and seeders (for example `tests/auth.seeders.ts`) are used to prepare and clean the database for auth‑related scenarios.

The following scripts are available in `package.json`:

- `yarn test:unit` runs only the unit tests.
- `yarn test:integration` runs only the integration tests.
- `yarn test:all` runs the full suite with the `.env.test` configuration.

### How to use

1. Ensure the test database is up and migrated (see the **Mock DB** section below, or run `yarn test:setup`).
2. Run unit tests during development:
    - `yarn test:unit`
3. Run integration tests when you need to verify the example HTTP endpoints:
    - `yarn test:integration`
4. Before pushing, run the full suite locally with:
    - `yarn test:all`

---

## Mock DB

### Implementation

Tests use an isolated PostgreSQL instance defined in `tests/docker-compose.test.yml`:

- Spins up a `postgres:16-alpine` container on port `5433` with an in‑memory data directory (`tmpfs`), so test data is ephemeral.
- Applies a health check (`pg_isready`) to ensure the database is ready before tests run.
- Enables the `pgcrypto` extension through the container command.

The test database lifecycle is orchestrated by scripts in `package.json`:

- `yarn test:db:up` starts the database container.
- `yarn test:db:down` stops and removes it.
- `yarn test:setup` brings the DB up and applies Prisma migrations against it.
- `yarn test:reset` cleans auth data, recreates the database and reruns migrations.
- `yarn test:teardown` stops the database container.

### How to use

1. Start the test database and run migrations:
    - `yarn test:setup`
2. Run whichever test command you need (`yarn test:unit`, `yarn test:integration`, or `yarn test:all`).
3. When you are done testing, stop the database:
    - `yarn test:teardown`

The `.env.test` file defines the connection string used by Prisma and the application when running the test scripts.

---

## Zod validation

### Implementation

Request and response validation are implemented with Zod schemas co‑located with each plugin:

- `src/plugins/auth/auth.validation.ts` defines `RegisterBodySchema` and `RegisterResponseSchema`.
- `src/plugins/users/users.validation.ts` defines `GetUserParamsSchema` and `CreateUserBodySchema`.
- `src/plugins/response.validation.ts` exports:
    - `ResponseSchema` and a generic `Response<T>` type.
    - `generateSchema` to convert a Zod schema to a JSON Schema used by Fastify for validation and OpenAPI generation.
    - `generateResponseSchema` to wrap a payload schema inside the standard `status` / `code` / `data` shape.

The route handlers plug these schemas into Fastify:

- `auth.routes.ts` uses `generateSchema(RegisterBodySchema)` for the request body and `generateResponseSchema(RegisterResponseSchema)` for the `200` response.
- `users.routes.ts` uses `generateSchema(GetUserParamsSchema)` for URL params.

This ensures strong runtime validation while keeping TypeScript types in sync via `z.infer<...>`.

### How to use

When adding a new route:

1. Create or extend a `*.validation.ts` file in the relevant plugin folder with your Zod schemas for params, body, query and/or response.
2. Export TypeScript types with `z.infer<typeof YourSchema>` so services and controllers can use strongly‑typed data.
3. In the corresponding `.routes.ts` file:
    - Import the schema(s).
    - Wrap them with `generateSchema` / `generateResponseSchema` and attach them to the Fastify `schema` field.
4. Regenerate or inspect the OpenAPI documentation to verify the new schemas are correctly applied.

---

## CI/CD

### Implementation

The CI pipeline is defined in `.github/workflows/test.yml` and runs on every push, pull request, and on manual trigger:

- Provisions a `postgres:16-alpine` service on port `5433`, mirroring the local test DB setup.
- Loads the `.env.test` file into the GitHub Actions environment.
- Installs dependencies with `yarn install --frozen-lockfile`.
- Generates the Prisma client with `yarn prisma:generate` and applies migrations with `yarn prisma migrate deploy`.
- Cleans auth test data with `yarn test:auth:clean`.
- Runs static checks (`yarn typecheck` and `yarn lint`).
- Executes the full test suite with `yarn test:all`.

### How to use

- **On pushes and pull requests**: the workflow runs automatically and will fail the check if type checking, linting, or tests fail.
- **Manual runs**: from the GitHub Actions tab, trigger the “Units and integrations tests” workflow via `workflow_dispatch` to re‑run the pipeline on any branch.
- To reproduce the same steps locally, run the commands in the same order:
    - `yarn test:setup`
    - `yarn test:auth:clean`
    - `yarn typecheck`
    - `yarn lint`
    - `yarn test:all`
