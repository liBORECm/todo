import { Router } from 'express'
import CRUDController from '../CRUD/CRUD.controller'
import { FinishalbeEntity } from './finishable.model'
import { FinishableService } from './finishable.service'
import ErrorCase from '../Error'

export default abstract class FinishableController<
    Entity extends FinishalbeEntity,
    Service extends FinishableService<Entity>,
> extends CRUDController<Entity, Service> {
    constructor(service: Service) {
        super(service)
    }

    public routes(): Router {
        const router = super.routes()

        router.post('/finish/:id', async (req, res) => {
            const id = Number(req.params.id)
            try {
                const result = await this.service.get(id)
                if (result == undefined) {
                    const { status, message } = ErrorCase.NotFound
                    return res.status(status).json({ error: message })
                }

                const finished = this.service
            } catch {
                const { status, message } = ErrorCase.IntenalError
                return res.status(status).json({ error: message })
            }
        })

        return router
    }
}
