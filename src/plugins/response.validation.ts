import { z } from 'zod'

export const ResponseSchema = z.object({
    status: z.string().min(1),
    code: z.string().min(1),
    data: z.object({})
})
export type Response<T> = z.infer<typeof ResponseSchema> & { data: T }
export const generateSchema = (schema: z.ZodTypeAny) =>
    z.toJSONSchema(schema, {
        target: 'draft-07',
        io: 'input'
    })

export const generateResponseSchema = (schema: z.ZodTypeAny) =>
    z.toJSONSchema(ResponseSchema.extend({ data: schema }), {
        target: 'draft-07',
        io: 'input'
    })
