import db from '../../db'
import { Knex } from 'knex'
import { CRUDEntity } from './CRUD.model'

export abstract class CRUDService<Entity extends CRUDEntity> {
    tableName: string

    constructor(tableName: string) {
        this.tableName = tableName
    }

    public async getAll(
        modifier?: Knex.QueryCallbackWithArgs<any, any>,
        sort?: { attribute: string; order: 'ASC' | 'DESC' },
        offset?: number,
        limit?: number,
    ): Promise<Array<Entity>> {
        let query = db(this.tableName)

        if (modifier !== undefined) query = query.modify(modifier)
        if (sort !== undefined)
            query = query.orderBy(sort.attribute, sort.order)
        if (offset !== undefined) query = query.offset(offset)
        if (limit !== undefined) query = query.limit(limit)

        return (await query) as Array<Entity>
    }

    public async get(id: number): Promise<Entity | undefined> {
        return (await db(this.tableName)
            .where('deleted_at', null)
            .where('id', id)
            .first()) as Entity | undefined
    }

    public async create(record: Entity): Promise<Entity | undefined> {
        ;(record as any).id = undefined
        ;(record as any).createdAt = new Date()
        ;(record as any).updatedAt = new Date()
        ;(record as any).deletedAt = undefined

        const resultId = Number(
            (await db(this.tableName).insert(record, 'id'))[0],
        )
        const result = await this.get(resultId)
        return result
    }

    public async edit(id: number, record: Entity): Promise<boolean> {
        const oldRecord = this.get(id)
        if (oldRecord === undefined) return false

        ;(record as any).id = undefined
        record.updatedAt = new Date()
        const result = await db(this.tableName).where('id', id).update(record)
        return result == 1
    }

    public async delete(id: number): Promise<boolean> {
        const record = await this.get(id)
        if (record === undefined) return false

        record.deletedAt = new Date()

        return this.edit(id, record)
    }
}
