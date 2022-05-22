/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { name: 'rest-api-role-permissions' }
})

Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logout')

// Auth
Route.group(() => {
  Route.resource('/user', 'UsersController')
  Route.resource('/role', 'RolesController')
}).middleware('auth')
