const Hapi = require('@hapi/hapi');
const tokenRoutes = require('./seguridad/routes/tokenRoutes');
const clienteRoutes = require('./cliente/routes/clienteRoutes');
const correoRoutes = require('./correo/routes/correoRoutes');

const H2o2 = require('@hapi/h2o2');
const HapiCors = require('hapi-cors');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register({ plugin: HapiCors, options: { origins: ['*'], methods: ['GET', 'POST', 'PUT', 'DELETE'] } });

  // Integra las rutas
  server.route(tokenRoutes);
  server.route(clienteRoutes);
  server.route(correoRoutes);
  // Inicia el servidor
  await server.start();
  console.log(`Servidor escuchando en: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
