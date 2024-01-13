const tokenController = require('../controllers/tokenController');

const routes = [
  {
    method: 'GET',
    path: '/tokens/generars',
    handler: tokenController.generarToken,
  },
  {
    method: 'GET',
    path: '/tokens/obtener/{ClienteID}',
    handler: tokenController.obtenerToken,
  },
  {
    method: 'GET',
    path: '/tokens/validar/{token}',
    handler: tokenController.validarToken,
  },
  {
    method: 'GET',
    path: '/tokens/actualizar/{ClienteID}/{token}',
    handler: tokenController.actualizarToken,
  },
];

module.exports = routes;
