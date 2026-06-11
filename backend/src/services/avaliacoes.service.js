const db = require('../database/connection');

function getAll() {
  return db.prepare(`
    SELECT * FROM avaliacoes ORDER BY criado_em DESC
  `).all();
}

function getByID(id) {
  const avaliacao = db.prepare(
    'SELECT * FROM avaliacoes WHERE id = ?'
  ).get(id);

  if (!avaliacao) return null;

  //Busca os itens avaliados desta avaliação
  avaliacao.itens = db.prepare(`
    SELECT * FROM itens_avaliados WHERE avaliacao_id = ?
  `).all(id);

  return avaliacao;
}

function create(dados) {
  // Usa transação - ou salva tudo ou não salva nada
  const salvar = db.transaction((dados) => {

    // 1. Salva o cabeçalho
    const resultado = db.prepare(`
      INSERT INTO avaliacoes (setor_id, nome_avaliador, data_avaliacao, media_geral)
      VALUES (@setor_id, @nome_avaliador, @data_avaliacao, @media_geral)
    `).run({
      setor_id: dados.setor_id,
      nome_avaliador: dados.nome_avaliador,
      data_avaliacao: dados.data_avaliacao,
      media_geral: dados.media_geral || 0
    });

    const avaliacaoId = resultado.lastInsertRowid;

    //2. Salva cada item avaliado
    const stmtItem = db.prepare(`
      INSERT INTO itens_avaliados
        (avaliacao_id, agrupador_nome, item_descricao, nota, anotacao)
      VALUES
        (@avaliacao_id, @agrupador_nome, @item_descricao, @nota, @anotacao)
    `);

    for (const item of dados.itens) {
      stmtItem.run({
        avaliacao_id: avaliacaoId,
        agrupador_nome: item.agrupador,
        item_descricao: item.item,
        nota: item.nota,
        anotacao: item.anotacao || ''
      });
    }

    return getByID(avaliacaoId);
  });

  return salvar(dados);
}

function remove(id) {
  const existe = getByID(id);
  if (!existe) return null;

  // Remove itens primeiro, depois o cabeçalho
  db.prepare('DELETE FROM itens_avaliados WHERE avaliacao_id = ?').run(id);
  db.prepare('DELETE FROM avaliacoes WHERE id = ?').run(id);

  return existe;
}

module.exports = { getAll, getByID, create, remove };
