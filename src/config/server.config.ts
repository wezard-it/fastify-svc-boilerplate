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
    firebase: {
        projectId?: string
        privateKeyId?: string
        privateKey?: string
        clientEmail?: string
        clientId?: string
    }
    email: {
        defaultSender: string
    }
    sendgrid: {
        sendgrid_key?: string
    }
    mailjet: {
        mailjetApiKey?: string
        mailjetApiSecret?: string
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
        FIREBASE_PROJECT_ID: joi.string(),
        FIREBASE_PRIVATE_KEY_ID: joi.string(),
        FIREBASE_PRIVATE_KEY: joi.string(),
        FIREBASE_CLIENT_EMAIL: joi.string(),
        FIREBASE_CLIENT_ID: joi.string(),
        SENDGRID_API_KEY: joi.string(),
        MAILJET_API_KEY: joi.string(),
        MAILJET_API_SECRET: joi.string(),
        EMAIL_DEFAULT_SENDER: joi.string().required()
    })
    .unknown()
    .required()

// validate envVars with joi

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
        googleStorageBucket: envVars.GOOGLE_STORAGE_BUCKET
    },
    firebase: {
        projectId: envVars.FIREBASE_PROJECT_ID,
        privateKeyId: envVars.FIREBASE_PRIVATE_KEY_ID,
        privateKey: envVars.FIREBASE_PRIVATE_KEY,
        clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
        clientId: envVars.FIREBASE_CLIENT_ID
    },
    sendgrid: {
        sendgrid_key: envVars.SENDGRID_API_KEY
    },
    mailjet: {
        mailjetApiKey: envVars.MAILJET_API_KEY,
        mailjetApiSecret: envVars.MAILJET_API_SECRET
    }
}

export default config
