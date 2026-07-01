import express, { Router } from 'express'
import todoTableController from './todoTable/todoTable.controller'

const router = express.Router()

//TODO make the modules autoload from glob pattern

router.use('/api/v1/', todoTableController)

export default router
