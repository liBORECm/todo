import db from '../../db'
import { CRUDService } from '../CRUD/CRUD.service'
import { FinishalbeEntity } from './finishable.model'

export abstract class FinishableService<
    Entity extends FinishalbeEntity,
    EnrichedEntity extends Entity,
> extends CRUDService<Entity, EnrichedEntity> {
    constructor(tableName: string) {
        super(tableName)
    }

    public async isFinished(id: number): Promise<boolean> {
        const record = await this.get(id)
        return record !== undefined && record.finishedAt !== null
    }

    public async finish(
        id: number,
        approveFinishing?: () => Promise<void>,
    ): Promise<EnrichedEntity> {
        if (approveFinishing !== undefined) await approveFinishing()

        const record = await super.get(id)
        const isFinished = await this.isFinished(id)
        if (isFinished) return record

        record.finishedAt = new Date()
        return this.edit(id, record)
    }
}
