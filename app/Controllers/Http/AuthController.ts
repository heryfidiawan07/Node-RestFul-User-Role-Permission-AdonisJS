import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
    public async login({auth, request, response}: HttpContextContract) {
        const password = request.input('password')

        // Lookup user manually
        const user = await User
            .query()
            .where('email', request.input('email'))
            .firstOrFail()

        // Verify password
        if (!(await Hash.verify(user.password, password))) {
            return response.badRequest('Invalid credentials')
        }

        // Generate token
        // return await auth.use('api').generate(user)
        return await auth.use('api').generate(user, {
            expiresIn: '30mins'
        })
    }

    public async register({request}: HttpContextContract) {
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

    public async logout({auth}: HttpContextContract) {
        await auth.use('api').revoke()
        return {
            revoked: true
        }
    }
}
