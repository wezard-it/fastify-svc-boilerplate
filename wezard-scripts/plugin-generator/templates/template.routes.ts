import { type FastifyPluginCallback } from 'fastify'
import templateController from './templates.controller'

const templateRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.get('/', {}, templateController.index)

    fastify.get('/:templateId', {}, templateController.show)

    fastify.post('/', {}, templateController.store)

    fastify.patch('/:templateId', {}, templateController.update)

    fastify.delete('/:templateId', {}, templateController.destroy)

    done()
}

export default templateRoutes
