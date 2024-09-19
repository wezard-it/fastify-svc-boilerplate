const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        RegisterBody: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                name: { type: 'string' },
                surname: { type: 'string' }
            },
            required: ['email', 'name', 'password', 'surname']
        },
        GetUserParams: { type: 'object', properties: { userId: { type: 'string' } }, required: ['userId'] },
        CreateUserBody: {
            type: 'object',
            properties: {
                email: { format: 'email', type: 'string' },
                name: { type: 'string' },
                surname: { minLength: 1, maxLength: 30, type: 'string' },
                role: { enum: ['ADMIN', 'USER'], type: 'string' },
                age: { minimum: 18, maximum: 99, type: 'number' },
                eye_color: { pattern: '^[0-9a-f]{6}$', type: 'string' }
            },
            required: ['age', 'email', 'eye_color', 'name', 'role', 'surname']
        }
    }
} as const
export default schema.definitions
