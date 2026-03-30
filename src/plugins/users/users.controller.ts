import { type FastifyReply, type FastifyRequest } from 'fastify'
import userService from './users.service'
import WezardError from '../../utils/WezardError'
import { GetUserParams } from './users.validation'

const NA = undefined

async function getUser(req: FastifyRequest<{ Params: GetUserParams }>, res: FastifyReply): Promise<void> {
    try {
        const user = await userService.getUserById(req.params.userId)
        return await res.wezardSuccess(res, user)
    } catch (e) {
        throw new WezardError('Error in getting user', 500, NA, NA, e as WezardError, true)
    }
}

export default {
    getUser
}
