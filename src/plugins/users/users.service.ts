import { User } from '@prisma/client'
import userRepository from './users.repository'
import WezardError from '../../utils/WezardError'
import { APIErrors } from '../../utils/consts'

async function getUserById(id: string): Promise<User> {
    const user = await userRepository.getUserById(id)

    if (!user) {
        throw WezardError.fromDef(APIErrors.UserNotFound)
    }

    return user
}

async function getUserByEmail(email: string): Promise<User> {
    const user = await userRepository.getUserByEmail(email)

    if (!user) {
        throw WezardError.fromDef(APIErrors.UserNotFound)
    }

    return user
}

export default {
    getUserById,
    getUserByEmail
}
