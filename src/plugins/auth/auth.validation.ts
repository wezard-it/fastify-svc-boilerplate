import z from 'zod'

export const RegisterBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
    name: z.string().min(1),
    surname: z.string().min(1)
})
export type RegisterBody = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = z.object({})
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
