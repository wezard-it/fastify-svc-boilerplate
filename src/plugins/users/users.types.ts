import { Role } from '@prisma/client'

export interface GetUserParams {
    userId: string
}

export interface CreateUserBody {
    email: string
    name: string
    surname: string
    role: Role
}
