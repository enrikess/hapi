const correoController = require('../controllers/correoController');

const routes = [
  {
    method: 'POST',
    path: '/correo/guardar',
    handler: correoController.guardarCorreo,
  },

];

module.exports = routes;
