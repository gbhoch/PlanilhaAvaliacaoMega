const agrupadoresService = require('../services/agrupadores.service');

function listar(req, res) {
  try {
    res.json(agrupadoresService.getAll());
  } catch (error) {
    console.error('Erro ao listar agrupadores: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

function buscarPorId(req, res) {
  try {
    const agrupador = agrupadoresService.getById(parseInt(req.params.id));
    if (!agrupador) return res.status(404).json({ erro: 'Agrupador não encontrado' });
    res.json(agrupador);
  } catch (error) {
    console.error('Erro ao buscar agrupador: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

function criar (req, res) {
  try {
    const { nome, descricao, ativo, itens } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo NOME é obrigatório!'});
    }
    res.status(201).json(agrupadoresService.create({ nome, descricao, ativo, itens }));
  } catch (error) {
    console.error('Erro ao criar agrupador: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

function atualizar(req, res) {
  try {
    const { nome, descricao, ativo, itens } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo NOME é obrigatório!' });
    }
    const resultado = agrupadoresService.update(parseInt(req.params.id), { nome, descricao, ativo, itens });
    if (!resultado) return res.status(404).json({ erro: 'Agrupador não encontrado'});
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao atualizar agrupador: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function remover(req, res) {
  try {
    const resultado = agrupadoresService.remove(parseInt(req.params.id));
    if (!resultado) return res.status(404).json({ erro: 'Agrupador não encotrado'});
    res.json({ mensagem: 'Agrupador removido com sucesso', agrupador: resultado });
  } catch (error) {
    console.error('Erro ao remover agrupador: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

// -- ITENS ------------------------

function adicionarItem(req, res) {
  try {
    const agrupadorId = parseInt(req.params.id);
    const { descricao, ativo } = req.body;

    if(!descricao || descricao.trim() === '') {
      return res.status(400).json({ erro: 'O campo DESCRIÇÃO e obrigatório!'});
    }

    const item = agrupadoresService.addItem(agrupadorId, { descricao, ativo });
    if (!item) return res.status(404).json({ erro: 'Agrupador não encontrado'});

    res.status(201).json(item);
  } catch (error) {
    console.error('Errp ao adicionar item: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function removerItem(req, res) {
  try {
    const item = agrupadoresService.removeItem(parseInt(req.params.itemId));
    if (!item) return res.status(404).json({ erro: 'Item não encontrado'});
    res.json({ mensagem: 'Item removido com sucesso', item});
  } catch (error) {
    console.error('Erro ao remover item: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function verificarUsoItem(req, res) {
  try {
    const itemId = parseInt(req.params.itemId);
    const emUso = agrupadoresService.itemEmUso(itemId);
    res.json({ emUso });
  } catch (error) {
    console.error('Erro ao verificar uso do item: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, adicionarItem, removerItem, verificarUsoItem };
