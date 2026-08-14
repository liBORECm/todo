import { CRUDService } from '../common/CRUD/CRUD.service'
import db from '../db'
import { User } from './user.model'

class UserService extends CRUDService<User, User> {}

export default new UserService('users')
