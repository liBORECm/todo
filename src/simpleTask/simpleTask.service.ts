import { FinishableService } from '../common/finishable/finishable.service'
import { SimpleTask } from './simpleTask.model'

class SimpleTaskService extends FinishableService<SimpleTask> {}

export default new SimpleTaskService('simple_tasks')
