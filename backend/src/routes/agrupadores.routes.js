const express = require('express');
const router = express.Router();
const agrupadoresController = require('../controllers/agrupadores.controller');

// CRUD de agrupadores
router.get('/',    agrupadoresController.listar);
router.get('/:id', agrupadoresController.buscarPorId);
router.post('/',   agrupadoresController.criar);
router.put('/:id',    agrupadoresController.atualizar);
router.delete('/:id', agrupadoresController.remover);

// Itens dentro de um agrupador
// POST   /agrupadores/1/itens -> adiciona itens
// DELETE /agrupadores/1/itens/2 -> remove itens

router.post('/:id/itens', agrupadoresController.adicionarItem);
router.delete('/:id/itens/:itemId', agrupadoresController.removerItem);
router.get('/itens/:itemId/uso', agrupadoresController.verificarUsoItem);

module.exports = router;
