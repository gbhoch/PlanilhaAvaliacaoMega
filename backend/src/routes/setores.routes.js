const express = require('express');

// Router é um mini-map Express para Organizar rotas
const router = express.Router();

const setoresController = require('../controllers/setores.controller');

// Cada linha define: MÉTODO + URL + função do controller
// A URL base /setores vem do server.js

router.get('/', setoresController.listar);          // GET      /setores
router.get('/:id', setoresController.buscarPorId);  // GET      /setores/1
router.post('/', setoresController.criar);          // POST     /setores
router.put('/:id', setoresController.atualizar);    // PUT      /setores/1
router.delete('/:id', setoresController.remover);   // DELETE   /setores/1

router.get('/:id/plano', setoresController.buscarComPlano);
router.put('/:id/plano', setoresController.salvarPlano);

module.exports = router;
