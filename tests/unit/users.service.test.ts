import usersService from '../../src/plugins/users/users.service'
import userRepository from '../../src/plugins/users/users.repository'
import WezardError from '../../src/utils/WezardError'
import { APIErrors } from '../../src/utils/consts'

jest.mock('../../src/plugins/users/users.repository')

const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('usersService', () => {
    describe('getUserById', () => {
        it('should return user when found', async () => {
            const fakeUser = { id: '1', email: 'user@example.com' } as never
            mockedUserRepository.getUserById.mockResolvedValueOnce(fakeUser)

            const result = await usersService.getUserById('1')

            expect(result).toBe(fakeUser)
        })

        it('should throw UserNotFound error when user does not exist', async () => {
            mockedUserRepository.getUserById.mockResolvedValueOnce(null as never)

            await expect(usersService.getUserById('1')).rejects.toMatchObject(
                WezardError.fromDef(APIErrors.UserNotFound)
            )
        })
    })

    describe('getUserByEmail', () => {
        it('should return user when found', async () => {
            const fakeUser = { id: '1', email: 'user@example.com' } as never
            mockedUserRepository.getUserByEmail.mockResolvedValueOnce(fakeUser)

            const result = await usersService.getUserByEmail('user@example.com')

            expect(result).toBe(fakeUser)
        })

        it('should throw UserNotFound error when user does not exist', async () => {
            mockedUserRepository.getUserByEmail.mockResolvedValueOnce(null as never)

            await expect(usersService.getUserByEmail('user@example.com')).rejects.toMatchObject(
                WezardError.fromDef(APIErrors.UserNotFound)
            )
        })
    })
})
