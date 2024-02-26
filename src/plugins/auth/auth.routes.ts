import { type FastifyPluginCallback } from 'fastify'
import authController from './auth.controller'
import _schema from '../../../_schema'
import { authToken } from '../../hooks/authentication'

const authRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.post(
        '/register',
        { preHandler: [authToken], schema: { body: _schema.RegisterBody } },
        authController.register
    )
    done()
}

export default authRoutes
