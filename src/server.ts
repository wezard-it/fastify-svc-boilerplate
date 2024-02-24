import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { auth } from 'firebase-admin'
import winston from 'winston'
import fastifyRequestContextPlugin from '@fastify/request-context'
import multipart from '@fastify/multipart'
import config from './config/server.config'
import router from './server.routes'
import WezardError from './utils/WezardError'
import { APIErrors } from './utils/consts'
import WezardErrorHandler from './hooks/WezardErrorHandler'
import WezardReqInitializer from './hooks/WezardReqInitializer'
import WezardResponeLogger from './hooks/WezardResponseLogger'
import { success, error } from './hooks/WezardApiResponse'

const server: FastifyInstance = Fastify({
    logger: false,
    ajv: {
        customOptions: {
            removeAdditional: 'all',
            allowUnionTypes: true
        }
    }
})

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string
            phone: string
        }
        admin?: boolean
        user_firebase?: auth.DecodedIdToken
        logger: winston.Logger
        partner?: {
            id: string
        }
    }

    interface FastifyReply {
        startTime: number
        wezardError: (reply: FastifyReply, error: WezardError, status?: string, code?: number) => Promise<void>
        wezardSuccess: (
            reply: FastifyReply,
            data: object,
            schema?: object,
            status?: number,
            code?: string
        ) => Promise<void>
    }
}

declare module '@fastify/request-context' {
    interface RequestContextData {
        requestId: string
    }
}

const getServer = async (): Promise<FastifyInstance> => {
    /** Mount readiness & liveness probes */
    server.get('/readinessCheck', (_req, res) => res.code(200).send())
    server.get('/livenessCheck', (_req, res) => res.code(200).send())
    server.get('/', (_req, res) => res.code(200).send())

    await server.register(helmet) // secure app by setting various HTTP headers
    await server.register(cors, {
        origin: '*',
        methods: 'GET,PUT,POST,DELETE,PATCH'
    })

    await server.register(fastifyRequestContextPlugin, {
        defaultStoreValues: () => ({
            requestId: 'system'
        })
    })

    server.decorateReply('wezardSuccess', success)
    server.decorateReply('wezardError', error)

    server.addHook('preHandler', WezardReqInitializer())
    server.addHook('onResponse', WezardResponeLogger())

    await server.register(multipart, {
        limits: {
            fieldNameSize: 100,
            fieldSize: 1000000,
            fields: 10,
            fileSize: 4000000,
            files: 1,
            headerPairs: 2000
        }
    })

    /** Mount error handler */
    server.setErrorHandler(WezardErrorHandler(config))

    server.setNotFoundHandler(() => {
        throw WezardError.fromDef(APIErrors.APINotFound)
    })

    // /** Mount all service routes */
    await server.register(router, { prefix: config.version })

    // FOR VERSIONING
    // await server.register(router, { prefix: 'v2' })

    return server
}

export default getServer
