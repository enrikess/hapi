// clienteRoutes.js
const Joi = require('joi');
const clienteController = require('../controllers/clienteController');

// Función para compilar el esquema de validación
const compileSchema = (schema) => {
    return Joi.compile(schema);
  };

const routes = [
    {
        method: 'GET',
        path: '/clientes',
        handler: clienteController.getAllClientes
    },
    {
        method: 'GET',
        path: '/clientes/{id}',
        handler: clienteController.getClienteById
    },
    {
        method: 'POST',
        path: '/clientes',
        handler: clienteController.createCliente
        
    },
    {
        method: 'PUT',
        path: '/clientes/{id}',
        handler: clienteController.updateCliente,
    },
    {
        method: 'DELETE',
        path: '/clientes/{id}',
        handler: clienteController.deleteCliente
    }
];

module.exports = routes;
