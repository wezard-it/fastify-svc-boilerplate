import { describe, expect, test, beforeAll, afterAll } from '@jest/globals'
import { type FastifyInstance } from 'fastify'
import { User } from '@prisma/client'
import { auth } from '../src/utils/firebase'
import db from '../src/utils/db'
import config from '../src/config/server.config'
import getServer from '../src/server'
import storage from '../src/utils/storage'

describe('Users tests', () => {
    let app: FastifyInstance
    let firebaseJwt: string
    let user: User

    beforeAll(async () => {
        app = await getServer()

        // Create a user for the tests
        await auth.createUser({
            email: 'email@prova.com',
            password: 'password'
        })

        user = await db.user.create({
            data: {
                email: 'email@prova.com',
                name: 'name',
                surname: 'surname',
                role: 'USER'
            }
        })

        const firebaseLoginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.google.firebaseApiKey}`

        const response = await fetch(firebaseLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'email@prova.com',
                password: 'password',
                returnSecureToken: true
            })
        })

        firebaseJwt = await response.json().then((data: { idToken: string }) => data.idToken)
    })

    afterAll(async () => {
        const userDb = await db.user.findFirst({
            where: { email: 'email@prova.com' }
        })

        if (userDb?.id) {
            await auth.deleteUser(userDb.id)

            await db.user.delete({
                where: { email: 'email@prova.com' }
            })

            await storage.deleteFile(`profile_pictures/${userDb.id}.png`)
        }

        await app.close()
    })

    test('Get User Profile', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/users/${user.id}`,
            headers: {
                Authorization: `Bearer ${firebaseJwt}`
            }
        })

        expect(response.statusCode).toBe(200)

        expect(JSON.parse(response.payload)).toMatchObject({
            status: 'SUCCESS',
            code: 200,
            data: {
                ...user
            }
        })
    })
})
