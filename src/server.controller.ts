import express, { Router } from 'express'
import todoTableController from './todoTable/todoTable.controller'
import simpleTaskController from './simpleTask/simpleTask.controller'
import repeatedTaskContorller from './repeatedTask/repeatedTask.controller'
import rTaskInstanceController from './rTaskInstance/rTaskInstance.controller'

const router = express.Router()

//TODO make the modules autoload from glob pattern

router.use('/api/v1/', todoTableController)
router.use('/api/v1/', simpleTaskController)
router.use('/api/v1/', repeatedTaskContorller)
router.use('/api/v1/', rTaskInstanceController)

export default router
