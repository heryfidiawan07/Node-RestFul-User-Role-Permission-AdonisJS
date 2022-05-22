import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public parent_menu: string

  @column()
  public parent_id: number

  @column()
  public name: string

  @column()
  public alias: string

  @column()
  public url: string

  @column()
  public icon: string
}
