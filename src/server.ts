import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
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
import swagger from '@fastify/swagger'
import path from 'path'
import fs from 'fs'
import { adminToken } from './hooks/authentication'
import fastifyStatic from '@fastify/static'

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
        user: TokenDecoded
        admin?: boolean
        logger: winston.Logger
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
    await server.register(swagger, {
        openapi: {
            info: {
                title: 'Boilerplate API',
                description: 'API documentation',
                version: '1.0.0'
            },
            tags: [
                { name: 'Auth', description: 'Auth related end-points' },
                { name: 'User', description: 'User related end-points' },
                { name: 'Health', description: 'Service health check' },
                { name: 'Docs', description: 'API Documentation' }
            ]
        }
    })

    const docsRootCandidates = [path.join(process.cwd(), 'src', 'docs'), path.join(__dirname, 'docs')]
    const docsRoot = docsRootCandidates.find((p) => fs.existsSync(p)) ?? docsRootCandidates[0]
    const openapiPath = path.join(docsRoot, 'openapi.json')

    server.get(
        '/docs/openapi.json',
        {
            preHandler: [adminToken],
            schema: {
                tags: ['Docs'],
                summary: 'Get OpenAPI specification in JSON format'
            }
        },
        (_req, reply) => {
            reply.header('Content-Type', 'application/json').send(fs.readFileSync(openapiPath, 'utf8'))
        }
    )

    await server.register(async function (instance) {
        instance.addHook('onRequest', async (req) => {
            await adminToken(req as never)
        })
        await server.register(fastifyStatic, {
            root: docsRoot,
            prefix: '/docs',
            index: 'index.html'
        })
    })
    await server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://unpkg.com'],
                styleSrc: ["'self'", 'https://unpkg.com'],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'", 'http://localhost:3000'],
                fontSrc: ["'self'"]
            }
        }
    })

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

    server.addHook('preValidation', WezardReqInitializer())
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
    server.setErrorHandler(WezardErrorHandler())

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
