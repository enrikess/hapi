const Token = require('../models/tokenModel');

const generarToken = async (request, h) => {

    const tokenGenerado = await Token.generarToken();
    //const tokenGenerado = await Token.generarTokenAleatorio();
    return { token: tokenGenerado };
};

const actualizarToken = async (request, h) => {
  const { ClienteID,Token } = request.params;
  console.log(Token)

  const tokenGenerado = await Token.actualizarToken(ClienteID,Token);
  return { token: tokenGenerado };
};

const obtenerToken = async (request, h) => {
  const { ClienteID } = request.params;

  const tokenGenerado = await Token.obtenerToken(ClienteID);
  return { token: tokenGenerado };
};

const validarToken = async (request, h) => {
  const { token } = request.params;
    const esValido = await Token.validarToken(token);
    if (esValido) {
      return { valido: true };
    } else {
      return { valido: false };
    }
};

module.exports = { generarToken, validarToken, obtenerToken, actualizarToken };
