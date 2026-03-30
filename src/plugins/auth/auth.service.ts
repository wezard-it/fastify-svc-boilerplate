import type { RegisterBody } from './auth.validation'
import userService from '../users/users.service'
import logger from '../../utils/logger'
import WezardError from '../../utils/WezardError'
import { APIErrors } from '../../utils/consts'

async function register(userRequest: RegisterBody): Promise<void> {
    logger.debug('🛠️ ~ register function call')

    // check if user already exists
    try {
        await userService.getUserByEmail(userRequest.email)
        throw WezardError.fromDef(APIErrors.UserAlreadyExists)
    } catch (error) {
        if (error instanceof WezardError && error.status !== 404) {
            throw error
        }
    }

    // TODO
}

export default { register }
