import { type FastifyPluginCallback } from 'fastify'
import authController from './auth.controller'
import { RegisterBodySchema, RegisterResponseSchema } from './auth.validation'
import { authToken } from '../../hooks/authentication'
import { generateSchema, generateResponseSchema } from '../response.validation'

const tag = 'Auth'
const authRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.post(
        '/register',
        {
            preHandler: [authToken],
            schema: {
                tags: [tag],
                body: generateSchema(RegisterBodySchema),
                response: {
                    200: generateResponseSchema(RegisterResponseSchema)
                },
                summary: 'Register a new user'
            }
        },
        authController.register
    )
    done()
}

export default authRoutes
