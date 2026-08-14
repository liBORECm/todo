import { Request, Response, Router } from 'express'
import notificationService from './notification.service'
import { InternalError, isHttpError } from '../common/httpError'

class NotificationContoller {
    public routes(): Router {
        const router = Router()

        router.post('/send', async (req: Request, res: Response) => {
            const userId = Number(req.query.userId)
            try {
                if (req.query.userId === undefined || Number.isNaN(userId)) {
                    await notificationService.sendNotifications()
                } else {
                    await notificationService.sendNotification(userId)
                }
                return res.sendStatus(200)
            } catch (e) {
                console.log(e)
                if (isHttpError(e))
                    return res.status(e.status).json({ error: e.message })

                const { status, message } = InternalError
                return res.status(status).json({ error: message })
            }
        })

        const router0 = Router()
        router0.use('/notification', router)
        return router0
    }
}

export default new NotificationContoller().routes()

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/notification/send:
 *  post:
 *      x-ai-generated: true
 *      tags:
 *          - Notification
 *      summary: Send an unfinished-tasks ntfy notification
 *      description: >
 *          Sends an ntfy push to the `todo-<userId>` topic listing that
 *          user's unfinished tasks. If `userId` is omitted, sends to every
 *          user instead.
 *      parameters:
 *          - name: userId
 *            in: query
 *            description: Id of the user to notify. Omit to notify all users.
 *            required: false
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Notification(s) sent
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 */
// #endregion
