import { Role } from '@prisma/client'
import z from 'zod'

export const GetUserParamsSchema = z.object({
    userId: z.string()
})
export type GetUserParams = z.infer<typeof GetUserParamsSchema>

export const CreateUserBodySchema = z.object({
    email: z.string(),
    name: z.string().min(1),
    surname: z.string().min(1).max(30),
    role: z.enum(Role),
    age: z.number().min(18).max(99),
    eye_color: z.string().regex(/^[0-9a-f]{6}$/)
})
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>
