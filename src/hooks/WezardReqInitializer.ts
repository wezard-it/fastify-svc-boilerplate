/* eslint-disable no-param-reassign */
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { requestContext } from '@fastify/request-context'
import WezardError from '../utils/WezardError'
import logger from '../utils/logger'

const NA = undefined

/**
 *  Request initializer Middleware.
 *
 *  Sets up the fastify request object and does some preliminary operations
 */
const WezardReqInitializer = () => (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
        reply.startTime = Date.now()
        // add app version to logs if passed
        const extra = {
            auth: req.headers.authorization || 'NA',
            query: req.query,
            params: req.params,
            headers: req.headers,
            body: req.body
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.logger = logger.child({ requestId: req.id })

        requestContext.set('requestId', req.id || 'system')

        if (req.url !== '/' && !req.headers['user-agent']?.includes('Contact research@pdrlabs.net'))
            req.logger.info(`START ----- ${req.method} -> ${req.url}`, { extra })

        return done()
    } catch (e) {
        return done(new WezardError('Request initialization error', 500, NA, NA, e as WezardError, false))
    }
}

export default WezardReqInitializer
