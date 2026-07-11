interface ErrorCase {
    status: number
    message: string
}

export const NotFound: ErrorCase = { status: 404, message: 'Not found' }
export const InternalError: ErrorCase = {
    status: 500,
    message: 'Internal error',
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
 *
 */
