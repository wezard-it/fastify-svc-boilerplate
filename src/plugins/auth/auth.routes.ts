import { type FastifyPluginCallback } from 'fastify'
import authController from './auth.controller'
import _schema from '../../../_schema'

const authRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.post('/register', { schema: { body: _schema.RegisterBody } }, authController.register)
    done()
}

export default authRoutes
