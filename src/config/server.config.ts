/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import joi from 'joi'
import env from 'dotenv'

env.config()

export type Config = {
    version: string
    env: string
    port: number
    serviceName: string
    logLevel: string
    logEnabled: boolean
    fullResponse: boolean
    databaseUrl: string
    serverUrl: string
    google: {
        googleProjectId?: string
        googleStorageBucket?: string
    }
    email: {
        defaultSender: string
    }
}

// define validation for all the env variables
const envSchema = joi
    .object({
        VERSION: joi.string().required(),
        NODE_ENV: joi.string().valid('development', 'test', 'staging', 'production').default('development'),
        RENDER_ENV: joi.string(),
        PORT: joi.number(),
        NAME: joi.string(),
        LOG_LEVEL: joi.string(),
        LOG_ENABLED: joi.boolean(),
        FULL_RESPONSE: joi.boolean(),
        DATABASE_URL: joi.string().required(),
        SERVER_URL: joi.string().required(),
        GOOGLE_PROJECT_ID: joi.string(),
        GOOGLE_STORAGE_BUCKET: joi.string(),
        EMAIL_DEFAULT_SENDER: joi.string().required()
    })
    .unknown()
    .required()

// validate envVars with joi
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value: envVars } = envSchema.validate(process.env)

// catch any config error
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

// create config file
const config: Config = {
    version: envVars.VERSION,
    env: envVars.RENDER_ENV || envVars.NODE_ENV,
    port: envVars.PORT,
    serviceName: envVars.NAME,
    logLevel: envVars.LOG_LEVEL,
    logEnabled: envVars.LOG_ENABLED,
    fullResponse: envVars.FULL_RESPONSE,
    databaseUrl: envVars.DATABASE_URL,
    serverUrl: envVars.SERVER_URL,
    email: {
        defaultSender: envVars.EMAIL_DEFAULT_SENDER
    },
    google: {
        googleProjectId: envVars.GOOGLE_PROJECT_ID,
        googleStorageBucket: envVars.GOOGLE_PROJECT_BUCKET
    }
}

export default config
