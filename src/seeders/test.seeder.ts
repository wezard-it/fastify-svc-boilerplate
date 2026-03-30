import { faker } from '@faker-js/faker'
import { CreateUserBody } from '../plugins/users/users.validation'
import db from '../utils/db'

export async function seed(): Promise<void> {
    const users: CreateUserBody[] = Array.from({ length: 10 }, () => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        role: 'USER',
        age: faker.number.int({ min: 18, max: 70 }),
        eye_color: faker.color.rgb({ prefix: '' })
    }))

    await db.user.createMany({
        data: users
    })
}

export async function clean(): Promise<void> {
    await db.user.deleteMany()
}

export default seed
