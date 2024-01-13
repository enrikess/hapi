// clienteModel.js
const mysql = require('mysql2/promise');
const redis = require('redis');
const util = require('util');


const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

const setAsync = util.promisify(redisClient.set).bind(redisClient);

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_hapi'
});

const getAllClientes = async () => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM clientes');
    connection.release();
    return rows;
};

const getClienteById = async (clienteId) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM clientes WHERE ClienteID = ?', [clienteId]);
    connection.release();
    return rows[0];
};

const createCliente = async (cliente,token) => {
    
    try {

        var connection = await pool.getConnection();

        const [result] = await connection.query('INSERT INTO clientes (Nombre, Apellido, CorreoElectronico) VALUES (?, ?, ?)', [cliente.Nombre, cliente.Apellido, cliente.CorreoElectronico]);
       
       
        await connection.query('UPDATE tokens set ClienteID = ? WHERE Token = ?', [result.insertId,token]);
       
        connection.release();

        const enviarCorreo = await consultarParametroEnvioCorreos();
        
        return {"ClienteID":result.insertId,'CorreoEnviado':enviarCorreo}; 
        

         
    } catch (error) {
        console.log(error)
    }

};

const updateCliente = async (clienteId, newData) => {
    const connection = await pool.getConnection();
    await connection.query('UPDATE clientes SET Nombre = ?, Apellido = ?, CorreoElectronico = ? WHERE ClienteID = ?', [newData.Nombre, newData.Apellido, newData.CorreoElectronico, clienteId]);
    connection.release();
};

const deleteCliente = async (clienteId) => {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM clientes WHERE ClienteID = ?', [clienteId]);
    connection.release();
};

// Maneja eventos de conexión y errores
redisClient.on('connect', () => {
    console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
    console.error(`Error de conexión a Redis: ${err}`);
});
// Función para obtener y registrar los parámetros en Redis
const registrarParametrosEnRedis = async () => {
    try {
        // Conecta a la base de datos y obtén los parámetros
        const connection = await pool.getConnection();
        const [parametros] = await connection.query('SELECT * FROM parametros_globales');
        connection.release();

        // Convierte los parámetros a formato JSON
        //const parametrosJSON = JSON.stringify(parametros);
        await redisClient.connect();
        // Almacena los parámetros en Redis bajo una clave específica
        
        //await Promise.all(parametros.map(async p => await setAsync(p.Nombre, (p.Habilitar) ? 'true' : 'false')));
        parametros.map(p => redisClient.set(p.Nombre, (p.Habilitar) ? 'true': 'false' ))
        //await redisClient.set('parametros_globales', parametrosJSON);
        console.log('Parámetros globales registrados en Redis.');
        //await consultarParametroEnvioCorreos();
        //console.log(x)
    } catch (error) {
        console.error('Error al registrar parámetros en Redis:', error);
    } finally {
        try {
            // Cierra la conexión a Redis cuando hayas terminado de usarla
            await redisClient.quit();
        } catch (error) {
            console.error('Error al cerrar la conexión a Redis:', error);
        }
    }
};
// Llama a la función para registrar los parámetros al iniciar el microservicio


// Función para consultar el parámetro de envío de correos en Redis
const consultarParametroEnvioCorreos = async () => {
    try {
        await redisClient.connect();
        getResultRedis = await redisClient.get("enviarCorreo")
        console.log(getResultRedis)
        return getResultRedis;
    } catch (error) {
        console.error('Error al registrar parámetros en Redis:', error);
    } finally {
        try {
            // Cierra la conexión a Redis cuando hayas terminado de usarla
            await redisClient.quit();
        } catch (error) {
            console.error('Error al cerrar la conexión a Redis:', error);
        }
    }
};

prueba = async () => {
    await registrarParametrosEnRedis();
}
prueba()
module.exports = { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };
