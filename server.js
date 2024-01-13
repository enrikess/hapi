// server.js
const Hapi = require('@hapi/hapi');

 // Registrar las rutas de cada microservicio
const clienteRoutes = require('./src/cliente/rutas');
const correoRoutes = require('./src/correo/rutas');
const seguridadRoutes = require('../src/seguridad/rutas');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    // Configuración de la base de datos
    const dbConnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'db_hapi'
    });

    // Puedes pasar la conexión a los controladores o rutas que lo necesiten
    server.app.dbConnection = dbConnection;

    // Registrar las rutas de cada microservicio
    await server.register(clienteRoutes);
    await server.register(correoRoutes);
    await server.register(seguridadRoutes);

    await server.start();
    console.log('Servidor en ejecución en:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();