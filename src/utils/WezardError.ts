/* eslint-disable no-param-reassign */
const GENERIC_ERROR_CODE = 'GENERIC_ERROR'

/**
 * A custom Error which implements some feautures such as a "history"
 * to better keep track of the causes of such error, and give a
 * complete and clean insight to the consumers of Westudents APIs.
 *
 * @extends Error
 */

export type PreviousError = { message: string; status: number; code: string; data: object; visible: boolean }

class WezardError extends Error {
    status: number

    code: string

    data: object = {}

    visible: boolean

    history: PreviousError[]

    /**
     * Constructs a WezardError object.
     *
     * @param {String}      message        A message describing the error
     * @param {Number}      status         HTTP status code that best fits the error
     * @param {String}      code           A literal code that identifies the error
     * @param {Object}      data           An object containing additional info about the error
     * @param {WezardError}  previousError  The parent error, if there is any
     * @param {Boolean}     visible        Indicates if the error should be visible by end user or not
     *
     */
    constructor(
        message = 'An error occurred',
        status = 500,
        code: string = GENERIC_ERROR_CODE,
        data: object = {},
        previousError?: WezardError | Error,
        visible = true
    ) {
        // create a history crumb of current error
        const historyCrumb = { message, status, code, data, visible }
        let stack
        let history: { message: string; status: number; code: string; data: object; visible: boolean }[] = []

        // if a previous error is present, override base properties
        if (previousError && previousError instanceof WezardError) {
            message = previousError.message
            status = previousError.status || 500
            code = previousError.code || GENERIC_ERROR_CODE
            data = previousError.data || {}
            visible = previousError.visible || false

            stack = previousError.stack
            history = previousError.history || [{ message, status, code, data, visible }]
        } else if (previousError && previousError instanceof Error) {
            message = previousError.message
            status = 500
            code = GENERIC_ERROR_CODE
            data = {}
            visible = false

            stack = previousError.stack
            history = [{ message, status, code, data, visible }]
        }

        // initialize the standard Error object
        super(message)

        // extend the standard Error object
        this.message = message
        this.status = status
        this.code = code
        this.data = data
        this.visible = visible

        // place the new error in the history stack
        this.history = [historyCrumb, ...history]

        // if a previous error stack existed, override current
        if (stack) this.stack = stack

        // updates the stack trace excluding the constructor line
        if (Error.captureStackTrace) Error.captureStackTrace(this, WezardError)
    }

    /**
     * @param {Object} definition           An error definition object
     * @param {String} definition.message   A message describing the error
     * @param {Number} definition.status    HTTP status code that best fits the error
     * @param {String} definition.code      A literal code that identifies the error
     * @param {Object} data                 An object containing additional info about the error
     * @param {WezardError} previousError         The parent error, if there is any
     * @param {Boolean} visible             Indicates if the error should be visible by end user or not
     */
    static fromDef(
        definition: { message: string; status: number; code: string },
        data?: object,
        previousError?: WezardError,
        visible?: boolean
    ) {
        const { message, status, code } = definition
        return new WezardError(message, status, code, data, previousError, visible)
    }
}

export default WezardError
