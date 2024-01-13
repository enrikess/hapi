const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_hapi'
});

 


const generarTokenAleatorio = () => {
    const longitud = 8;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < longitud; i++) {
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return token;
};

const generarToken = async () => {
    try {
        var connection = await pool.getConnection();
        
        const [rows] = await connection.query('SELECT * FROM tokens WHERE ClienteID=0');

        if (rows.length>0) {
            return rows[0].Token;
        }
        connection.release();
        
        const token = generarTokenAleatorio();
        
        connection = await pool.getConnection();
        
        
        await connection.query('INSERT INTO tokens (Token) VALUES (?)', [token]);
        connection.release();

        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw error; // O devuelve un mensaje de error personalizado
    }
};

const actualizarToken = async (ClienteID,Token) => {
    try {

        const connection = await pool.getConnection();
        await connection.query('UPDATE tokens Token= ? WHERE ClienteID = ?', [Token,ClienteID]);

        //await connection.query('UPDATE clientes SET Nombre = ?, Apellido = ?, CorreoElectronico = ? WHERE ClienteID = ?', [newData.Nombre, newData.Apellido, newData.CorreoElectronico, clienteId]);

        connection.release();

        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw error; // O devuelve un mensaje de error personalizado
    }
};


const validarToken = async (token) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM tokens WHERE token = ?', [token]);
    connection.release();

    return rows.length > 0;
};

const obtenerToken = async (ClienteID) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM tokens WHERE ClienteID = ?', [ClienteID]);
    connection.release();
    return rows[0];
};

module.exports = { generarToken, validarToken, obtenerToken, actualizarToken,generarTokenAleatorio };
