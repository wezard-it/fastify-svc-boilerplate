import winston, { format } from 'winston'
import Transport from 'winston-transport'
import util from 'util'
import { requestContext } from '@fastify/request-context'
import config from '../config/server.config'

// import { LogtailTransport } from '@logtail/winston'
// import { Logtail } from '@logtail/node'
// import Sentry from 'winston-transport-sentry-node'

const transports: Transport[] = []

// CONSOLE TRANSPORT
function transform(info: any) {
    const args = info[Symbol.for('splat')]
    if (args) {
        info.message = util.format(info.message, ...args)
    }
    if (!info.requestId) info.requestId = requestContext.get('requestId') || 'system'
    return info
}

function utilFormatter() {
    return { transform }
}

transports.push(
    new winston.transports.Console({
        format: format.combine(
            format.printf(
                ({ level, message, label, timestamp, stack, requestId }) =>
                    `${timestamp} [${label || '-'}] ${requestId || 'system'} ${level}: ${message} ${stack || ''}`
            ),
            format.colorize({
                all: true
            })
        )
    })
)

/** 
LOGTAIL TRANSPORT
const logtail = new Logtail('logatail_key')
if (config.env === 'production') {
   transports.push(new LogtailTransport(logtail, { level: config.logLevel }))
}

SENTRY TRANSPORT
const sentryOptions = {
    sentry: {
        dsn: 'sentry_dsn'
    },
    level: 'error'
}
if (config.env === 'production') {
    transports.push(new Sentry(sentryOptions))
}
*/

// WINSTON LOGGER
const logger = winston.createLogger({
    level: config.logLevel,
    format: format.combine(
        format.json(),
        format.errors({
            stack: true
        }),
        format.label({ label: config.serviceName }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        utilFormatter()
    ),
    defaultMeta: { service: config.serviceName },
    transports
})

export default logger
