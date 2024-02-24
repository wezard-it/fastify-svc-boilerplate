import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import WezardError from '../utils/WezardError'

const NA = undefined

/**
 *  Reply logger hook.
 *
 */
const WezardResponeLogger = () => (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
        if (req.url !== '/')
            req.logger.info(`END ----- ${req.method} -> ${req.url} : ${Math.round(Date.now() - reply.startTime)} ms`)
        return done()
    } catch (e) {
        return done(new WezardError('Request initialization error', 500, NA, NA, e as WezardError, false))
    }
}

export default WezardResponeLogger
