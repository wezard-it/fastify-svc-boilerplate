import { type FastifyReply } from 'fastify'
import fastJson from 'fast-json-stringify'
import WezardError, { PreviousError } from '../utils/WezardError'
import config from '../config/server.config'

const GENERIC_SUCCESS_STATUS = 'GENERIC_SUCCESS'
const SUCCESS_CODE = 'SUCCESS'
const NA = undefined

const buildFullErrorResponse = (wezardError: WezardError) => {
    const historyString = wezardError.history.reduce((acc, curr) => `${acc} -> ${curr.message}`, '').substring(4) // Remove initial "arrow"

    return {
        message: wezardError.message,
        status: wezardError.status,
        code: wezardError.code,
        data: wezardError.data,
        visible: wezardError.visible,
        message_history: historyString,
        error_history: wezardError.history
    }
}

const buildRestrictedErrorResponse = (wezardError: WezardError) => {
    // filter only public errors
    const visibleErrors = wezardError.history.reduce(
        (acc: PreviousError[], curr) => (curr.visible ? [...acc, curr] : acc),
        []
    )

    // get the first public error
    const firstError = visibleErrors[visibleErrors.length - 1]

    // build history string
    const historyString = visibleErrors.reduce((acc: string, curr) => `${acc} -> ${curr.message}`, '').substring(4) // Remove initial "arrow"

    return {
        message: firstError.message,
        status: firstError.status,
        code: firstError.code,
        data: firstError.data,
        message_history: historyString
    }
}

async function success(
    reply: FastifyReply,
    data: object,
    schema?: object,
    status?: number,
    code?: string
): Promise<void> {
    if (schema !== undefined && schema !== null) {
        const stringify = fastJson(schema)
        const responseBody = {
            status: GENERIC_SUCCESS_STATUS,
            code: code ?? SUCCESS_CODE,
            data: JSON.parse(stringify(data) as string) as object
        }
        await reply.status(status ?? 200).send(responseBody)
    } else {
        const responseBody = {
            status: GENERIC_SUCCESS_STATUS,
            code: code ?? SUCCESS_CODE,
            data
        }

        await reply.status(status ?? 200).send(responseBody)
    }
}

async function error(reply: FastifyReply, wezardError: WezardError): Promise<void> {
    let newError = wezardError
    if (!(wezardError instanceof WezardError))
        newError = new WezardError(NA, NA, NA, NA, wezardError as WezardError, false)

    // create different responses based on the environment we are running in
    const responseBody =
        config.env !== 'production' || config.fullResponse
            ? buildFullErrorResponse(newError)
            : buildRestrictedErrorResponse(newError)

    await reply.status(wezardError.status ?? 500).send(responseBody)
}
export { success, error }
