const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_hapi'
});

 
const guardarCorreo = async (cliente) => {
    
    try {

        const connection = await pool.getConnection();

        cabecera = `Bienvenido ${cliente.Nombre}`
        cuerpo = `Bienvenido tu token es ${cliente.Token} y tu correo ${cliente.CorreoElectronico}`
        console.log(cliente)
        
        //const cabecera = 
        const [result] = await connection.query('INSERT INTO correo (Cabecera, Cuerpo, ClienteID) VALUES (?, ?, ?)', [cabecera, cuerpo, cliente.ClienteID]);
       
        connection.release();   
        //console.log(result.insertId) 
            
        return {"CorreoID":result.insertId,'CorreoEnviado':'true'}; 
        

         
    } catch (error) {
        console.log(error)
    }

};


module.exports = { guardarCorreo };
