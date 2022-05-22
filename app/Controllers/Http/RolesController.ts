import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'

export default class RolesController {
    public async index({}: HttpContextContract) {
		const data = await Role.query().paginate(1)
		return data.serialize({
			fields: ['id', 'name', 'created_at', 'updated_at']
		})
	}

	public async store({request}: HttpContextContract) {
		const trx = await Database.transaction()

		try {
			const role = new Role()
			role.name = request.input('name')

			role.useTransaction(trx)
			await role.save()
			// Performs insert query inside the pivot table
			await role.related('permissions').attach(request.input('permissions'))
			
			await trx.commit()
			return {status: true, message: 'OK'}
		} catch (error) {
			await trx.rollback()
			return {status: false, message: error.message}
		}
	}

	public async show({params}: HttpContextContract) {
		const data = await Role.findOrFail(params.id)
		return data.serialize({
			fields: ['id', 'name', 'created_at', 'updated_at']
		})
	}

	public async update({request, params}: HttpContextContract) {
		const trx = await Database.transaction()
		
		try {
			const role = await Role.findOrFail(params.id, { client: trx })
			await Role
			.query({ client: trx })
			.where('id', params.id)
			.update({ 
				name: request.input('name'),
			})
			// Performs update query inside the pivot table
			await role.related('permissions').sync(request.input('permissions'))

			await trx.commit()
			return {status: true, message: 'OK'}
		} catch (error) {
			await trx.rollback()
			return {status: false, message: error.message}
		}
	}

	public async destroy({params}: HttpContextContract) {
		const trx = await Database.transaction()
		
		try {
			await Role
			.query({ client: trx })
			.where('id', params.id)
			.delete()

			await trx.commit()
			return {status: true, message: 'OK'}
		} catch (error) {
			await trx.rollback()
			return {status: false, message: error.message}
		}
	}
}
