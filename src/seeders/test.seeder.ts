import { faker } from '@faker-js/faker'
import { CreateUserBody } from '../plugins/users/users.types'
import db from '../utils/db'

export async function seed(): Promise<void> {
    const users: CreateUserBody[] = Array.from({ length: 10 }, () => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        role: 'USER'
    }))

    await db.user.createMany({
        data: users
    })
}

export async function clean(): Promise<void> {
    await db.user.deleteMany()
}

export default seed
