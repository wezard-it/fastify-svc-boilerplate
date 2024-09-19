import { Role } from '@prisma/client'

export interface GetUserParams {
    userId: string
}

export interface CreateUserBody {
    /**
     * @TJS-format email
     */
    email: string
    name: string

    /**
     * @minLength 1
     * @maxLength 30
     */
    surname: string

    role: Role

    /**
     * @minimum 18
     * @maximum 99
     */
    age: number

    /**
     * @pattern ^[0-9a-f]{6}$
     */
    eye_color: string
}
