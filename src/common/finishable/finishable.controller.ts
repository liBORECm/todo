import { Router } from 'express'
import CRUDController from '../CRUD/CRUD.controller'
import { FinishalbeEntity } from './finishable.model'
import { FinishableService } from './finishable.service'
import HttpError, { InternalError, isHttpError } from '../httpError'

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
                //Check that the record exists
                await this.service.get(id)

                const finished = await this.service.finish(id)
                return res.status(200).json(finished)
            } catch (e) {
                console.log(e)
                if (isHttpError(e))
                    return res.status(e.status).json({ error: e.message })

                const { status, message } = InternalError
                return res.status(status).json({ error: message })
            }
        })

        return router
    }
}
