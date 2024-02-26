import { type FastifyPluginCallback } from 'fastify'
import usersController from './users.controller'
import _schema from '../../../_schema'

const userRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.get('/:userId', { schema: { params: _schema.GetUserParams }, preHandler: [] }, usersController.getUser)

    done()
}

export default userRoutes
