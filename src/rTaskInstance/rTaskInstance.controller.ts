import express, { Router } from 'express'
import FinishableController from '../common/finishable/finishable.controller'
import { RTaskInstance } from './rTaskInstance.model'
import rTaskInstanceService, {
    RTaskInstanceService,
} from './rTaskInstance.service'

class RTaskInstanceController extends FinishableController<
    RTaskInstance,
    RTaskInstance,
    RTaskInstanceService
> {
    constructor() {
        super(rTaskInstanceService)
    }

    public routes(): Router {
        const router = super.routes()

        const router0 = express.Router()
        router0.use('/r-task-instances', router)
        return router0
    }
}

export default new RTaskInstanceController().routes()
