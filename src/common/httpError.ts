interface ErrorCase {
    status: number
    message: string
}

export const NotFound: ErrorCase = { status: 404, message: 'Not found' }
export const InternalError: ErrorCase = {
    status: 500,
    message: 'Internal error',
}
export const ParentDoesntExist: ErrorCase = {
    status: 400,
    message: 'Parent doenst exist',
}
export const CannotCreateCycles: ErrorCase = {
    status: 400,
    message: 'Cannot create cycles',
}
export const UnfinishedSubtask: ErrorCase = {
    status: 400,
    message: 'A subtask is unfinished',
}

export default class HttpError extends Error {
    public readonly status: number
    public readonly message: string

    constructor(errorCase: ErrorCase) {
        super(errorCase.message)
        this.status = errorCase.status
        this.message = errorCase.message
    }
}

export function isHttpError(e: unknown): e is HttpError {
    return 'status' in (e as any) && 'message' in (e as any)
}

/**
 * @swagger
 * components:
 *  schemas:
 *      InternalError:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  default: "Internal error"
 *      NotFoundError:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  default: "Not found"
 *      BadRequestError:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *
 */
