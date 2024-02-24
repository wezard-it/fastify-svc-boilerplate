import type { Bindings } from 'fastify/types/logger'
import config from './server.config'

const pinoConfig = {
    level: config.logLevel,
    transport: {
        targets: [
            {
                level: 'debug',
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    ignore: 'pid,hostname,env,version,serviceName'
                }
            }
        ]
    },
    formatters: {
        bindings: (bindings: Bindings) => ({
            ...bindings,
            env: config.env,
            version: config.version,
            serviceName: config.serviceName
        })
    }
}

export default pinoConfig
