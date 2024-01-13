const correoModel = require('../models/correoModel');

const guardarCorreo = async (request, h) => {

  const Cliente = request.payload;

  
  const CorreoID = await correoModel.guardarCorreo(Cliente);
  return { data:CorreoID };
};


module.exports = { guardarCorreo };
