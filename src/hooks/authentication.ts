import { FastifyRequest } from 'fastify'
import { APIErrors } from '../utils/consts'
import WezardError from '../utils/WezardError'
import firebaseAdmin from '../utils/firebase'

export const authFirebase = async (req: FastifyRequest<{ Body: never }>) => {
    if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
        throw WezardError.fromDef(APIErrors.MissingAuthentication)
    }

    const bearerToken = req.headers.authorization.split(' ')[1]
    try {
        const userPayload = await firebaseAdmin.auth().verifyIdToken(bearerToken)

        if (!userPayload) throw WezardError.fromDef(APIErrors.InvalidToken)

        req.user_firebase = userPayload
    } catch (error) {
        throw WezardError.fromDef(APIErrors.InvalidToken)
    }
}
