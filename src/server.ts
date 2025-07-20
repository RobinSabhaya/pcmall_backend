import Fastify from 'fastify'
import app from './app'
import { config } from './config/config'

const server = Fastify({ logger: true })

app(server)
  .then(() => {
    server.listen({ port: +config.port! || 3000 })
  })
  .catch((err) => {
    server.log.error(err)
    process.exit(1)
  })
