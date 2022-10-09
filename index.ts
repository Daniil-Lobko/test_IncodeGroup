import fastify from 'fastify'
import './src/config'
import {changeBoss, getUsers, login, register} from "./src";
import fastifySwagger from '@fastify/swagger'

const app = fastify()
const mongoConnectionUrl = process.env.MONGODB_CONNECTION_URL

app.get('/', async (request, reply) => {
  return `started`
})

console.log('succussfully connected')

app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: '/api/docs',
  swagger: {
    info: {
      title: 'IncodeGroup API',
      description: 'IncodeGroup API documents',
      version: 'v0',
    },
    schemes:  ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})


app.register((app, options, done) => {
  app.register(register);
  app.register(login);
  app.register(getUsers);
  app.register(changeBoss);
  done();
}, {prefix: '/v0'});


app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at http://127.0.0.1:8080/`)
})