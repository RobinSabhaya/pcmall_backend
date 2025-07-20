import { FastifyInstance } from 'fastify'
import routes from './routes/v1'

export default async function app(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/cors'))
  await fastify.register(import('./plugins/mongoose'))
  await fastify.register(import('./plugins/jwt'))
  fastify.register(routes, { prefix: '/v1' })
}
