const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoes.controller');

router.get('/',       avaliacoesController.listar);
router.get('/:id',    avaliacoesController.buscarPorId);
router.post('/',      avaliacoesController.criar);
router.delete('/:id', avaliacoesController.remover);

module.exports = router;
