// clienteController.js
const clienteModel = require('../models/clienteModel');

const getAllClientes = async (request, h) => {
    const clientes = await clienteModel.getAllClientes();
    return clientes;
};

const getClienteById = async (request, h) => {
    const clienteId = request.params.id;
    const cliente = await clienteModel.getClienteById(clienteId);
    //console.log("23",cliente);
    return cliente;
};

const createCliente = async (request, h) => {
    const nuevoCliente = request.payload.cliente;
    const token = nuevoCliente.Token;
    
    const clienteId = await clienteModel.createCliente(nuevoCliente,token);
    return { data:clienteId };
};

const updateCliente = async (request, h) => {
    const clienteId = request.params.id;
    const newData = request.payload;
    await clienteModel.updateCliente(clienteId, newData);
    return { message: 'Cliente actualizado correctamente' };
};

const deleteCliente = async (request, h) => {
    const clienteId = request.params.id;
    await clienteModel.deleteCliente(clienteId);
    return { message: 'Cliente eliminado correctamente' };
};

module.exports = { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };
