const mysql = require('mysql2/promise');
const amqp = require('amqplib');


const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_hapi'
});

const rabbitSettings = {
   //protocol: 'amqp',
    hostname: 'localhost',
    port: 15672,
    username: 'admin',
    password: 'admin',
    vhost:'/',
    //authMechanism:['PLAIN','AMQPLAIN','EXTERNAL']
}



const guardarCorreo = async (cliente) => {

    try {

        const connection = await pool.getConnection();

        cabecera = `Bienvenido ${cliente.Nombre}`
        cuerpo = `Bienvenido tu token es ${cliente.Token} y tu correo ${cliente.CorreoElectronico}`
    

        //const cabecera = 
        const [result] = await connection.query('INSERT INTO correo (Cabecera, Cuerpo, ClienteID) VALUES (?, ?, ?)', [cabecera, cuerpo, cliente.ClienteID]);

        connection.release();
        await guardarEmailRabbit(cliente.CorreoElectronico,cabecera,cuerpo);
        console.log(cliente.CorreoElectronico) 
        return { "CorreoID": result.insertId, 'CorreoEnviado': 'true' };



    } catch (error) {
        console.log(error)
    }

};

// Función para enviar un correo
async function guardarEmailRabbit(to, subject, body) {
    try {
        const rabbitMQConnectionConfig = {
            url: `amqp://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.hostname}:${rabbitSettings.port}`
        };

        const connection = await amqp.connect(rabbitMQConnectionConfig);

        console.log("conexion creada")

        const channel = await connection.createChannel();
        const queueName = 'EnviaCorreo';

        await channel.assertQueue(queueName, { durable: false });

        const message = {
            to: to,
            subject: subject,
            body: body,
        };

        // Envía el mensaje a la cola
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Correo enviado a la cola.');

        // Cierra la conexión
        await connection.close();
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
}


async function consumirCorreoRabbit() {
    try {
        const rabbitMQConnectionConfig = {
            url: `amqp://${rabbitSettings.username}:${rabbitSettings.password}@${rabbitSettings.hostname}:${rabbitSettings.port}`
        };

        const connection = await amqp.connect(rabbitMQConnectionConfig);

        const channel = await connection.createChannel();

        const queueName = 'EnviaCorreo';

        //await channel.deleteQueue(queueName);

        await channel.assertQueue(queueName, { durable: false });

        console.log('Esperando correos en la cola. Para salir, presiona CTRL+C');

        channel.consume(queueName, (msg) => {
            //console.log(msg)
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());

                // Aquí procesa el correo electrónico según la lógica de tu aplicación
                console.log(`Correo recibido para: ${message.to}, Asunto: ${message.subject}, Cuerpo: ${message.body}`);

                // Avisa a RabbitMQ que el mensaje fue procesado con éxito
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error al consumir correos:', error);
    }
}

consumirCorreoRabbit()

module.exports = { guardarCorreo };
