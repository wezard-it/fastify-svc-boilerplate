/**
 * A list of the response codes that the API can send back.
 */
export const APIResponseCodes = {
    Created: 'CREATED',
    Modified: 'MODIFIED',
    Deleted: 'DELETED',
    DeletedPermanently: 'DELETED_PERMANENTLY',
    Success: 'GENERIC_SUCCESS',
    Error: 'GENERIC_ERROR',
    Hibernated: 'HIBERNATED',
    Restored: 'RESTORED',

    NotFound: 'NOT_FOUND',
    MissingPermissions: 'MISSING_PERMISSIONS',
    MissingQueryParameter: 'MISSING_QUERY_PARAMETER',
    MissingAuthentication: 'MISSING_AUTHENTICATION',
    InvalidContent: 'INVALID_CONTENT',
    TokenBlacklisted: 'TOKEN_BLACKLISTED',
    InvalidToken: 'INVALID_TOKEN',
    InvalidCode: 'INVALID_CODE',
    InvalidCredentials: 'INVALID_CREDENTIALS',
    UserAlreadyExists: 'USER_ALREADY_EXISTS'
}

/**
 * A list of the errors that the API can send back.
 */
export const APIErrors = {
    APINotFound: {
        message: 'API not found',
        status: 404,
        code: APIResponseCodes.NotFound
    },
    MissingAuthentication: {
        message: 'Authentication is needed, but not provided',
        status: 401,
        code: APIResponseCodes.MissingAuthentication
    },
    InvalidToken: {
        message: 'Invalid token',
        status: 401,
        code: APIResponseCodes.InvalidToken
    },
    InvalidCode: {
        message: 'Invalid code',
        status: 401,
        code: APIResponseCodes.InvalidCode
    },
    InvalidCredentials: {
        message: 'Invalid email or password',
        status: 400,
        code: APIResponseCodes.InvalidCredentials
    },
    InvalidQueryContent: {
        message: 'Request query did not pass validation',
        status: 400,
        code: APIResponseCodes.InvalidContent
    },
    InvalidParamContent: {
        message: 'Request params did not pass validation',
        status: 400,
        code: APIResponseCodes.InvalidContent
    },
    InvalidBodyContent: {
        message: 'Request body did not pass validation',
        status: 400,
        code: APIResponseCodes.InvalidContent
    },
    MissingPermission: {
        message: 'User does not have the right permissions.',
        status: 403,
        code: APIResponseCodes.MissingPermissions
    },
    UserNotFound: {
        message: 'No such user exists!',
        status: 404,
        code: APIResponseCodes.NotFound
    },
    UserAlreadyExists: {
        message: 'User already exists!',
        status: 400,
        code: APIResponseCodes.UserAlreadyExists
    }
}
