const { get } = require('node:http');
const db = require('../database/connection');

function getAll(){
  // Busca agrupadores com seus itens em uma única query
  const agrupadores = db.prepare('SELECT * FROM agrupadores ORDER BY id ASC').all();

  return agrupadores.map(agrupador => ({
    ...agrupador,
    itens: db.prepare(
      'SELECT * FROM itens_avaliacao WHERE agrupador_id = ? ORDER BY id ASC'
    ).all(agrupador.id)
  }));
}

function getById(id) {
  const agrupador = db.prepare('SELECT * FROM agrupadores WHERE id = ?').get(id);
  if (!agrupador) return null;

  agrupador.itens = db.prepare(
    'SELECT * FROM itens_avaliacao WHERE agrupador_id = ? ORDER BY id ASC'
  ).all(id);

  return agrupador;
}

function create(dados) {
  const resultado = db.prepare(`
    INSERT INTO agrupadores (nome, descricao, ativo)
    VALUES (@nome, @descricao, @ativo)
  `).run({
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo !== undefined ? (dados.ativo ? 1 : 0) : 1
  });

  const agrupadorId = resultado.lastInsertRowid;

  // Salva os itens, se vierem junto
  if (Array.isArray(dados.itens)) {
    const stmtItem = db.prepare(`
      INSERT INTO itens_avaliacao (agrupador_id, descricao, ativo)
      VALUES (?, ?, 1)
    `);
    for (const item of dados.itens) {
      stmtItem.run(agrupadorId, item.descricao);
    }
  }

  return getById(agrupadorId);
}

function update(id, dados) {
  const existe = getById(id);
  if (!existe) return null;

  // Atualiza os dados do agrupador
  db.prepare(`
    UPDATE agrupadores
    SET nome = @nome, descricao = @descricao, ativo = @ativo
    WHERE id = @id
  `).run({
    id,
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo !== undefined ? (dados.ativo ? 1 : 0) : 1
  });

  if (Array.isArray(dados.itens)) {
    // IDs dos itens que vieram do frontend (os que devem permanecer)
    const idsRecebidos = dados.itens
      .filter(item => item.id)        // só os que já têm id (existentes)
      .map(item => item.id);

    // Busca os itens atuais no banco
    const itensAtuais = db.prepare(
      'SELECT id FROM itens_avaliacao WHERE agrupador_id = ?'
    ).all(id);

    // Remove apenas os itens que foram excluídos no frontend
    // E que NÃO estão em uso em nenhum plano
    for (const itemAtual of itensAtuais) {
      if (!idsRecebidos.includes(itemAtual.id)) {
        const emUso = db.prepare(
          'SELECT COUNT(*) AS total FROM plano_avaliacao WHERE item_id = ?'
        ).get(itemAtual.id);

        if (emUso.total === 0) {
          db.prepare('DELETE FROM itens_avaliacao WHERE id = ?').run(itemAtual.id);
        }
        // Se estiver em uso, mantém o item para não quebrar o plano
      }
    }

    // Adiciona os itens novos (os que não têm id)
    const stmtItem = db.prepare(`
      INSERT INTO itens_avaliacao (agrupador_id, descricao, ativo)
      VALUES (?, ?, 1)
    `);
    for (const item of dados.itens) {
      if (!item.id) {
        stmtItem.run(id, item.descricao);
      }
    }
  }

  return getById(id);
}

function remove(id) {
  const existe = getById(id);
  if (!existe) return null;

  // Remove os itens do agrupador primeiro (integridade referencial)
  db.prepare('DELETE FROM itens_avaliacao WHERE agrupador_id = ?').run(id);
  db.prepare('DELETE FROM agrupadores WHERE id = ?').run(id);

  return existe;
}

// -- ITENS --------------------------------

function addItem(agrupadorId, dados) {
  const agrupador = getById(agrupadorId);
  if (!agrupador) return null;

  const resultado = db.prepare(`
    INSERT INTO itens_avaliacao (agrupador_id, descricao, ativo)
    VALUES (@agrupador_id, @descricao, @ativo)
  `).run({
    agrupador_id: agrupadorId,
    descricao: dados.descricao,
    ativo: dados.ativo !== undefined ? dados.ativo : 1
  });

  return db.prepare('SELECT * FROM itens_avaliacao WHERE id = ?').get(resultado.lastInsertRowid);
}

function removeItem(itemId) {
  const item = db.prepare('SELECT * FROM itens_avaliacao WHERE id = ?').get(itemId);
  if (!item) return null;

  db.prepare('DELETE FROM itens_avaliacao WHERE id = ?').run(itemId);
  return item;
}

function itemEmUso(itemId) {
  const resultado = db.prepare(
    'SELECT COUNT(*) AS total FROM plano_avaliacao WHERE item_id = ?'
  ).get(itemId);
  return resultado.total > 0;
}

module.exports = { getAll, getById, create, update, remove, addItem, removeItem, itemEmUso };
