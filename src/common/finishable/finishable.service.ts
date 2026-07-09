import db from '../../db'
import { CRUDService } from '../CRUD/CRUD.service'
import { FinishalbeEntity } from './finishable.model'

export abstract class FinishableService<
    Entity extends FinishalbeEntity,
> extends CRUDService<Entity> {
    constructor(tableName: string) {
        super(tableName)
    }

    public async isFinished(id: number): Promise<boolean> {
        const record = await this.get(id)
        return record !== undefined && record.finishedAt !== null
    }

    public async finish(id: number): Promise<boolean> {
        const record = await this.get(id)
        if (record === undefined) return false

        record.finishedAt = new Date()
        return this.edit(id, record)
    }
}
