import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('parent_menu')
      table.integer('parent_id')
      table.string('name')
      table.string('alias')
      table.string('url')
      table.string('icon')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
