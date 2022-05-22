import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRoles extends BaseSchema {
  protected tableName = 'permission_role'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE')
      table.integer('permission_id').unsigned().references('permissions.id')
      table.unique(['role_id', 'permission_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
