import { type FastifyPluginAsync } from 'fastify'
import authRoutes from './plugins/auth/auth.routes'
import usersRoutes from './plugins/users/users.routes'

const router: FastifyPluginAsync = async (instance) => {
    await instance.register(authRoutes, { prefix: '/auth' })
    await instance.register(usersRoutes, { prefix: '/users' })

    instance.get(
        '/health',
        {
            schema: {
                tags: ['Health'],
                summary: 'Get service health status'
            }
        },
        async (request, reply) => {
            await reply.wezardSuccess(reply, {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                pid: process.pid,
                platform: process.platform,
                nodeVersion: process.version,
                appVersion: process.env.npm_package_version,
                environment: process.env.NODE_ENV,
                host: request.hostname
            })
        }
    )
}

export default router
