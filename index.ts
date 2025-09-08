import fastifyCron from 'fastify-cron'
import config from './src/config/server.config'
import logger from './src/utils/logger'

import getServer from './src/server'
import WezardError from './src/utils/WezardError'
import db from './src/utils/db'

const main = async () => {
    try {
        await db.$connect()

        logger.info(`Database connection setup! ${config.databaseUrl}`)

        const server = await getServer()

        server.addHook('onClose', async () => {
            logger.info(`${config.serviceName} was closed`)
            // close the db connection
            await db.$disconnect()
        })

        // use only in case of single instance or in development
        await server.register(fastifyCron, {
            jobs: [
                {
                    cronTime: '0 * * * *', // Everyhour
                    onTick: () => logger.info('Internal cronjob'),
                    startWhenReady: true
                }
            ]
        })

        await server.listen({ port: config.port, host: '0.0.0.0' })

        server.cron.startAllJobs()

        logger.info(`Server running at port ${config.port}`)
    } catch (err) {
        await db.$disconnect()
        logger.info(`Could not start ${config.serviceName}`, { error: err as WezardError })
        process.exit(1)
    }

    process.on('SIGTERM', () => process.exit())
}

main().catch((e) => {
    logger.error(e)
    process.exit(1)
})
