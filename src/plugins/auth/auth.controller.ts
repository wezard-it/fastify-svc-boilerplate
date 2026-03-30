import { type FastifyReply, type FastifyRequest } from 'fastify'
import authService from './auth.service'
import type { RegisterBody } from './auth.validation'
import WezardError from '../../utils/WezardError'

const NA = undefined

async function register(req: FastifyRequest<{ Body: RegisterBody }>, res: FastifyReply): Promise<void> {
    try {
        const userRequest = req.body
        await authService.register(userRequest)

        await res.wezardSuccess(res, {})
    } catch (e) {
        throw new WezardError(`Error registering user`, 400, NA, NA, e as WezardError, true)
    }
}

export default { register }
