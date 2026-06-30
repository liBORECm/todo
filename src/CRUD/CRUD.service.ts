import db from '../db'
import { Knex } from 'knex'

export abstract class CRUDService<Entity> {
  tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  public async getAll(
    modifier?: Knex.QueryCallbackWithArgs<any, any>,
  ): Promise<Array<Entity>> {
    const query = !modifier
      ? db(this.tableName)
      : db(this.tableName).modify(modifier)
    return (await query) as Array<Entity>
  }

  public async get(id: number): Promise<Entity> {
    return (await db(this.tableName).where('id', id).first()) as Entity
  }

  public async create(table: Entity): Promise<boolean> {
    ;(table as any).id = undefined
    const result = await db(this.tableName).insert(table)
    return result.length == 1
  }

  public async edit(id: number, table: Entity): Promise<boolean> {
    ;(table as any).id = undefined
    const result = await db(this.tableName).where('id', id).update(table)
    return result == 1
  }

  public async delete(id: number): Promise<boolean> {
    const result = await db(this.tableName).where('id', id).delete()

    return result == 1
  }
}
