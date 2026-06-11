const avaliacoesService = require('../services/avaliacoes.service');

function listar(req, res) {
  try {
    res.json(avaliacoesService.getAll());
  } catch (error) {
    console.error('Erro ao listar avaliações: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function buscarPorId(req, res) {
  try {
    const avaliacao = avaliacoesService.getByID(parseInt(req.params.id));
    if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada'});
    res.json(avaliacao);
  } catch (error) {
    console.error('Erro ao buscar avaliação: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

function criar(req, res) {
  try {
    const { setor_id, nome_avaliador, data_avaliacao, media_geral, itens } = req.body;

    if (!nome_avaliador || nome_avaliador.trim() === '') {
      return res.status(400).json({ erro: 'O campo nome_avaliador é obrigatório'});
    }
    if (!data_avaliacao) {
      return res.status(400).json({ erro: 'O campo data_avaliacao é obrigatório'});
    }
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'É necessário pelo menos um item avaliado'});
    }

    const novaAvaliacao = avaliacoesService.create({
      setor_id,
      nome_avaliador,
      data_avaliacao,
      media_geral,
      itens
    });

    res.status(201).json(novaAvaliacao);
  } catch (error) {
    console.error('Erro ao criar Avaliação: ', error);
    res.status(500).json({ erro: 'Erro interno do servidor'});
  }
}

function remover(req, res) {
  try {
    const resultado = avaliacoesService.remove(parseInt(req.params.id));
    if (!resultado) return res.status(404).json({ erro: 'Avaliação não encontrada'});
    res.json({ mensagem: 'Avaliação removida com sucesso'})
  } catch (error) {
    console.error('Erro ao remover avaliação: ', resultado);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { listar, buscarPorId, criar, remover };
