import authService from '../../src/plugins/auth/auth.service'
import userService from '../../src/plugins/users/users.service'
import WezardError from '../../src/utils/WezardError'
import { APIErrors } from '../../src/utils/consts'

jest.mock('../../src/plugins/users/users.service')

const mockedUserService = userService as jest.Mocked<typeof userService>

describe('authService.register', () => {
    const baseBody = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe'
    }

    it('should throw UserAlreadyExists when user with email already exists', async () => {
        mockedUserService.getUserByEmail.mockResolvedValueOnce({} as never)

        await expect(authService.register(baseBody as never)).rejects.toMatchObject({
            status: APIErrors.UserAlreadyExists.status
        })
    })

    it('should rethrow WezardError that is not 404', async () => {
        const error = WezardError.fromDef(APIErrors.MissingAuthentication)
        mockedUserService.getUserByEmail.mockRejectedValueOnce(error)

        await expect(authService.register(baseBody as never)).rejects.toBe(error)
    })
})
