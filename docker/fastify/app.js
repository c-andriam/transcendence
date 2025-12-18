const fastify = require('fastify')({ logger: true })
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.get('/health', async (request, reply) => {
  try {
    await client.connect()
    const res = await client.query('SELECT NOW()')
    await client.end()
    return { status: 'ok', db: res.rows[0].now }
  } catch (err) {
    return { status: 'error', error: err.message }
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
