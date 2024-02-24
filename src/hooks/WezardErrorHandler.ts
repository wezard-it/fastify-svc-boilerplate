/* eslint-disable no-console */
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import WezardError from '../utils/WezardError'
import { Config } from '../config/server.config'

const NA = undefined

/**
 * Error handler Middleware.
 *
 * Handles all responses in case an error occurs
 * @param {Config} config The config of the service
 */

const WezardErrorHandler = (config: Config) => {
    if (!config) throw new WezardError("Required 'config' param", 500, NA, NA, NA, false)

    return (err: WezardError, req: FastifyRequest, reply: FastifyReply) => {
        let newErr = err
        try {
            // cast to a WezardError
            if (!(err instanceof WezardError)) {
                if ((err as FastifyError).validation) {
                    const errValidation = err as FastifyError
                    newErr = new WezardError(errValidation.message, 400, 'VALIDATION_ERROR', NA, NA, true)
                } else {
                    newErr = new WezardError(NA, NA, NA, NA, err, true)
                }
            }

            if (!req.headers['user-agent']?.includes('Contact research@pdrlabs.net'))
                req.logger.error(newErr.message, {
                    extra: {
                        authorization: req.headers.authorization || 'NA',
                        history: err.history || 'NA',
                        body: req.body || {},
                        url: `${req.method} -> ${req.url}`
                    },
                    error: err
                })
        } catch (e) {
            console.error('---------------- ERROR ----------------')
            console.log(`${req.method} -> ${req.url}`)
            console.log('-----')
            console.log(e)
            console.log('-----')
            console.log(newErr)
            console.log('---------------------------------')
        }

        return reply.wezardError(reply, err)
    }
}

export default WezardErrorHandler
