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
  const stmt = db.prepare(`
    INSERT INTO agrupadores (nome, descricao, ativo)
    VALUES (@nome, @descricao, @ativo)
  `);

  const resultado = stmt.run({
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo !== undefined ? dados.ativo : 1
  });

  return getById(resultado.lastInsertRowid);
}

function update(id, dados) {
  const existe = getById(id);
  if (!existe) return null;

  db.prepare(`
    UPDATE agrupadores
    SET nome = @nome, descricao = @descricao, ativo = @ativo
    WHERE id = @id
  `).run({
    id,
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo !== undefined ? dados.ativo : 1
  });

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

module.exports = { getAll, getById, create, update, remove, addItem, removeItem };
