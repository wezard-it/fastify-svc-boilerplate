import { type User } from '@prisma/client'
import db from '../../utils/db'
import type { CreateUserBody } from './users.validation'

async function store(user: CreateUserBody): Promise<User> {
    return db.user.create({
        data: {
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
        }
    })
}

async function getUserById(id: string): Promise<User | null> {
    return db.user.findUnique({
        where: {
            id
        }
    })
}

async function getUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
        where: {
            email
        }
    })
}

export default {
    store,
    getUserById,
    getUserByEmail
}
