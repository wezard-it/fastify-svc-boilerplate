import { FastifyRequest } from 'fastify'
import { APIErrors } from '../../utils/consts'
import WezardError from '../../utils/WezardError'
import config from '../../config/server.config'

import verifyFirebaseToken from './firebase-auth'

// CHANGE IT FOR NEW IMPLEMENTATION
const authTokenVerify: (token: string) => Promise<TokenDecoded> = verifyFirebaseToken

export const authToken = async (req: FastifyRequest<{ Body: never; Params: never; Querystring: never }>) => {
    if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
        throw WezardError.fromDef(APIErrors.MissingAuthentication)
    }

    const bearerToken = req.headers.authorization.split(' ')[1]
    try {
        const userPayload = await authTokenVerify(bearerToken)

        if (!userPayload) throw WezardError.fromDef(APIErrors.InvalidToken)

        req.user = userPayload
    } catch (_error) {
        throw WezardError.fromDef(APIErrors.InvalidToken)
    }
}

export const adminToken = async (req: FastifyRequest<{ Body: never; Params: never; Querystring: never }>) => {
    const xApiKey = req.headers['x-api-key'] as string | undefined

    if (!xApiKey || xApiKey !== config.adminApiKey) throw WezardError.fromDef(APIErrors.MissingAuthentication)
    req.admin = true
}
