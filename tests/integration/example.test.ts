/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyInstance } from 'fastify'
import getServer from '../../src/server'
import config from '../../src/config/server.config'

describe('Integration tests examples', () => {
    let fastify: FastifyInstance

    beforeAll(async () => {
        fastify = await getServer()
        await fastify.ready()
    })

    afterAll(async () => {
        await fastify.close()
    })

    describe('GET `/docs/openapi.json` route', () => {
        it('should return 200 and the OpenAPI JSON', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/docs/openapi.json',
                headers: {
                    'x-api-key': config.adminApiKey
                }
            })

            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toMatch(/application\/json/)

            const bodyUnknown: unknown = response.json()
            const body = bodyUnknown as { openapi: string; paths: Record<string, unknown> }
            expect(body).toHaveProperty('openapi')
            expect(body).toHaveProperty('paths')
        })
    })
})
