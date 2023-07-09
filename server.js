const Fastify = require("fastify");
const fastify = Fastify({
  logger: true,
});

fastify.post("/", async (request, reply) => {
  reply.type("text/plain").code(200);
  return "3";
});

fastify.listen({ port: 6000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});
