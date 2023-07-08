const Fastify = require('fastify')
const fastify = Fastify({
    logger: true
})

// start a server on 6000 that returns true
fastify.get('/', async (request, reply) => {
    reply.type('application/json').code(200)
    return { hello: 'world' }
})
  
fastify.listen({ port: 6000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
})