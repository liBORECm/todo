import { Router } from 'express'
import CRUDController from '../CRUD/CRUD.controller'
import { FinishalbeEntity } from './finishable.model'
import { FinishableService } from './finishable.service'
import ErrorCase from '../Error'

export default abstract class FinishableController<
    Entity extends FinishalbeEntity,
    EnrichedEntity extends Entity,
    Service extends FinishableService<Entity, EnrichedEntity>,
> extends CRUDController<Entity, EnrichedEntity, Service> {
    constructor(service: Service) {
        super(service)
    }

    public routes(): Router {
        const router = super.routes()

        router.post('/finish/:id', async (req, res) => {
            const id = Number(req.params.id)
            try {
                const record0 = await this.service.get(id)
                if (record0 == undefined) {
                    const { status, message } = ErrorCase.NotFound
                    return res.status(status).json({ error: message })
                }

                const finished = await this.service.finish(id)
                if (!finished) {
                    const { status, message } = ErrorCase.InternalError
                    return res.status(status).json({ error: message })
                }

                const record = await this.service.get(id)
                return res.status(200).json(record)
            } catch {
                const { status, message } = ErrorCase.InternalError
                return res.status(status).json({ error: message })
            }
        })

        return router
    }
}
