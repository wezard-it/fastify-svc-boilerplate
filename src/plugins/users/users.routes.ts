import { type FastifyPluginCallback } from 'fastify'
import usersController from './users.controller'
import { generateSchema } from '../response.validation'
import { GetUserParamsSchema } from './users.validation'

const tag = 'User'

const userRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.get(
        '/:userId',
        {
            schema: {
                tags: [tag],
                params: generateSchema(GetUserParamsSchema),
                summary: 'Get user by ID'
            },
            preParsing: []
        },
        usersController.getUser
    )
    done()
}

export default userRoutes
