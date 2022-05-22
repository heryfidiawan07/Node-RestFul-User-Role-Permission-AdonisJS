import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
	public async index({}: HttpContextContract) {
		const data = await User.query().paginate(1)
		return data.serialize({
			fields: ['id', 'username', 'email', 'created_at', 'updated_at']
		})
	}

	public async store({request}: HttpContextContract) {
		const trx = await Database.transaction()

		try {
			await trx
			.insertQuery()
			.table('users')
			.insert({
				username: request.input('username'),
				email: request.input('email'),
				password: await Hash.make(request.input('password')),
			})

			await trx.commit()
			return {status: true, message: 'OK'}
		} catch (error) {
			await trx.rollback()
			return {status: false, message: error.message}
		}
	}

	public async show({params}: HttpContextContract) {
		const data = await User.findOrFail(params.id)
		return data.serialize({
			fields: ['id', 'username', 'email', 'created_at', 'updated_at']
		})
	}

	public async update({request, params}: HttpContextContract) {
		const trx = await Database.transaction()
		
		try {
			await User
			.query({ client: trx })
			.where('id', params.id)
			.update({ 
				username: request.input('username'),
				email: request.input('email'),
				password: await Hash.make(request.input('password')),
			})

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
			await User
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
