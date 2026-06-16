const { parse } = require('node:path');
const setoresService = require('../services/setores.service');

// -- GET /setores --
function listar(req, res) {
  try {
    const setores = setoresService.getAll();
    res.json(setores);
  } catch (error) {
    console.error('Erro ao listar setores: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

// -- GET /setores/:id --
function buscarPorId(req, res) {
  try {
    // req.params contém os parâmetros de URL (:id)
    const id = parseInt(req.params.id);
    const setor = setoresService.getById(id);

    if (!setor) {
      // 404 = Not found
      return res.status(404).json({ erro: 'Setor não encontrado' });
    }

    res.json(setor);
  } catch (error) {
    console.error('Erro ao buscar setor: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

// -- POST /setores --
function criar(req, res) {
  try {
    // req.body contém os dados enviados pelo frontend (JSON)
    const { nome, descricao, ativo } = req.body;

    // Validação básica
    if (!nome || nome.trim() === ''){
      return res.status(400).json({ erro: 'O campo NOME é obrigatório!' });
    }

    const novoSetor = setoresService.create({ nome, descricao, ativo });
    // 201 = Created
    res.status(201).json(novoSetor);
  } catch (error) {
    console.error('Erro ao criar setor: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

// -- PUT /setores/:id --
function atualizar(req, res){
  try {
    const id = parseInt(req.params.id);
    const { nome, descricao, ativo } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo NOME é obrigatório!'});
    }

    const setorAtualizado = setoresService.update(id, { nome, descricao, ativo });

    if (!setorAtualizado) {
      return res.status(404).json({ erro: 'Setor não encontrado'});
    }

    res.json(setorAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar o setor: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

// -- DELETE /setores/:id --
function remover(req, res) {
  try {
    const id = parseInt(req.params.id);
    const setorRemovido = setoresService.remove(id);

    if (!setorRemovido) {
      return res.status(404).json({ erro: 'Setor não encontrado' });
    }

    res.json({ mensagem: 'Setor removido com sucesso ', setor: setorRemovido});
  } catch (error) {
    console.error('Erro ao remover setor: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function buscarComPlano(req, res) {
  try {
    const setor = setoresService.getByIdComPlano(parseInt(req.params.id));
    if (!setor) return res.status(404).json({ erro: 'Setor não encontrado' });
    res.json(setor);
  } catch (error) {
    console.error('Erro ao buscar setor com plano:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

function salvarPlano(req, res) {
  try {
    const setorId = parseInt(req.params.id);
    const { planoDeAvaliacao } = req.body;

    if (!Array.isArray(planoDeAvaliacao)) {
      return res.status(400).json({ erro: 'planoDeAvaliacao deve ser um array' });
    }

    const resultado = setoresService.salvarPlano(setorId, planoDeAvaliacao);
    if (!resultado) return res.status(404).json({ erro: 'Setor não encontrado' });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao salvar plano:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, buscarComPlano, salvarPlano };
