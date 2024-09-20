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
-   `schema:generate`: Executes a custom script (`wezard-scripts/schema-generator/index.js`) to generate schema-related artifacts. It generates a TypeScript schema from `.types.ts` files in the `src` directory using `typescript-json-schema`, outputting to `_schema.ts`. This final file can be used for validation in `.routes.ts` files. For typescript annotations see [this doc](https://github.com/YousefED/typescript-json-schema/blob/master/api.md)
-   `prisma:generate`: generate Prisma types
-   `terraform:init:staging`: init Terraform staging configuration
-   `terraform:init:prod`: init Terraform prod configuration
-   `terraform:apply:staging`: apply Terraform staging configuration
-   `terraform:apply:prod`: apply Terraform prod configuration

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

-   `WezardApiResponse.ts` defines two methods (`success` and `error`) which are appended to the FastifyReply object as `wezardSuccess` and `wezardError` to standardize success and error responses. The `success` function is also responsible for outgoing validation given a schema passed as a third parameter.
-   `WezardErrorHandler.ts` defines error management and logging. It handles all responses in case an error occurs.
-   `WezardReqInitializer.ts` sets the logger for the request and logs the initial message.
-   `WezardResponseLogger.ts` logs the final request message.
-   `authentication` folder contains authentication functions to use in `.routes.ts` plugin files. E.g., `instance.post('/login', { preHandler: [authToken], schema: { body: _schema.LoginBody } }, authController.login)`. Here you can define different kind of authentication (eg: authToken) and for each of them define their implementation (eg: `firebase-auth.ts`)

---

## Prisma

Prisma for PostgreSQL focuses on defining database schemas and generating Prisma Client through the `npx prisma generate` command. This process bridges the gap between database schemas and application code, enhancing type safety and data access. For in-depth details, refer to the [official Prisma documentation](https://www.prisma.io/docs/orm/reference/prisma-cli-reference).

The `prisma` folder contains:

-   `schema.prisma`, which is the DB model definition (you can switch from PostgreSQL to MongoDB by changing the provider line).
-   The `migrations` folder, where migrations will be stored after the command `npx prisma migrate dev`.
-   The `dbml` folder contains a DBML document of the DB model (you can paste it on [dbdiagram.io](https://dbdiagram.io/)).

The Prisma client is then instantiated in `src/utils/db.ts`.

---

## Utils

In the `src/utils` folder, you can also

find:

-   Firebase notification utility (sends notifications given device tokens, and notification title and message).
-   Storage utility (standard implementation is with Google Cloud Storage).
-   Mail utility (standard implementations are with SendGrid and MailJet).
-   Definition of Wezard Error, used whenever an error needs to be thrown. You can throw it in two different ways:
    -   `throw WezardError.fromDef(APIErrors.InvalidToken)`, in this case, you are using a predefined error from the `consts.ts` file.
    -   `throw new WezardError("message", 500, "GENERIC_CODE", {"data": "error data"}, previousError, isVisible)`, in this case, you are constructing a new error. Follow the documentation in `WezardError.ts` to understand how to use the input parameters.

---

## Logger (`src/utils/logger.ts`)

The provided logger setup in Node.js using Winston showcases the system's flexibility and extensibility, particularly in how it integrates various transports for comprehensive logging solutions. This setup is designed to be adaptable to various environments and requirements, from simple console outputs for development to sophisticated logging mechanisms like Logtail and Sentry for production, ensuring effective logging practices across different stages of application deployment.

For a detailed walkthrough and code snippets, please refer to the original content or documentation associated with Winston and the specific transports you are interested in integrating.

---

## Terraform

### Files

#### 1. `main.tf`

This file defines the main configuration for the Google Cloud infrastructure required by the Fastify service. It includes:

-   **Google Cloud Provider**: Specifies the GCP project and region.
-   **API Enabling**: Activates the necessary APIs to manage resources like Cloud Run, Cloud SQL, Artifact Registry, and IAM.
-   **GitHub Actions Service Account**: Creates a service account that is used to deploy from GitHub Actions with the following roles:
    -   `roles/artifactregistry.admin`
    -   `roles/iam.serviceAccountUser`
    -   `roles/run.admin`
-   **Cloud SQL (PostgreSQL 16)**: Creates and configures a Cloud SQL instance running PostgreSQL 16.
-   **Artifact Registry**: Creates a Docker repository to host the Docker images used by the service.
-   **Cloud Run**: Defines the Cloud Run service, including environment variables, CPU and memory configurations, and autoscaling.
-   **IAM Binding**: Grants necessary permissions to the service account for deploying on Cloud Run.
-   **Outputs**: Returns key information like the Cloud Run URL and the service account key in JSON format.

#### 2. `variables.tf`

This file defines all the variables needed to configure the infrastructure. Each variable can be overridden by a `.tfvars` file specific to the environment (e.g., `staging.tfvars`).

Key variables include:

-   `project_id`: The GCP project ID.
-   `service_name`: The name of the Cloud Run service.
-   `db_instance_name`: The name of the Cloud SQL (PostgreSQL) instance.
-   `db_name`, `db_user`, `db_pwd`: Database configurations.
-   `min_instances`, `max_instances`: Parameters for the minimum and maximum number of Cloud Run instances.
-   `cpu_limit`, `memory_limit`: Resource limits for Cloud Run.
-   `bucket_name`: The name of the Cloud Storage bucket.
-   `github_sa_name`: The name of the service account used by GitHub Actions.
-   `tmp_image_enabled`: A boolean that determines whether to use a temporary image for the initial deployment when the Docker image is not yet available in the Artifact Registry. This is useful during the first deployment to avoid failures if the target image has not been pushed yet. If `true`, it allows the use of a placeholder image until the final image is available.

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

-   **Cloud Run URL**: The public URL of the Cloud Run service.
-   **Database Connection String**: The connection string to the Cloud SQL PostgreSQL database.
-   **Artifact Registry URL**: The Docker repository URL for deployment.
-   **Service Account Key**: The service account key in BASE64 format, to be used for configuring GitHub Actions.

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
