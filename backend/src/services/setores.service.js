// Importa conexão com o Banco
const db = require('../database/connection');

// -- GET ALL --
// Retorna todos os setores
function getAll(){
  // .prepare() compila a query SQL
  // .all() executa e retorna todas as linhas como array

  const stmt = db.prepare('SELECT * FROM setores ORDER BY id ASC');
  return stmt.all();
}

// -- GET BY ID --
// Retorna um setor pelo ID
function getById(id){
  // .get() retorna apenas uma linha (ou undefined se não encontrar)
  const stmt = db.prepare('SELECT * FROM setores WHERE id = ?');
  return stmt.get(id);
  // O '?' é um placeholder - nunca concatenar valores na query! -> Previne SQL Injection
}

// -- CREATE --
// Cria um novo setor
function create(dados){
  const stmt = db.prepare(`
    INSERT INTO setores (nome, descricao, ativo)
    VALUES (@nome, @descricao, @ativo)`
  );

  // .run() executa INSERT/UPDATE/DELETE
  // Retorna { changes: 1, lastInsertRowid: X }
  const resultados = stmt.run({
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo ? 1 : 0 // Converte boolean para 1/0
  });

  // Busca e retorna o registro recém-criado
  return getById(resultados.lastInsertRowid);
}

// -- UPDATE --
// Atualiza um setor existente
function update(id, dados) {
  // Primeiro verifica se o setor existe
  const existe = getById(id);
  if (!existe) return null;

  const stmt = db.prepare(`
    UPDATE setores
    SET nome = @nome,
        descricao = @descricao,
        ativo = @ativo
    WHERE id = @id
  `);

  stmt.run({
    id,
    nome: dados.nome,
    descricao: dados.descricao || '',
    ativo: dados.ativo ? 1 : 0
  });

  // Retorna o registro atualizado
  return getById(id);
}

// -- DELETE --
// Remove um setor pelo ID
function remove(id){
  const existe = getById(id);
  if (!existe) return null;

  const stmt = db.prepare('DELETE FROM setores WHERE id = ?');
  stmt.run(id);

  return existe;  // Retorna o que foi deletado
}

// Retorna setor com plano de avaliação completo
function getByIdComPlano(id) {
  const setor = db.prepare('SELECT * FROM setores WHERE id = ?').get(id);
  if (!setor) return null;

  // Busca as linhas do plano deste setor, juntando dados de agrupador e item
  const linhas = db.prepare(`
    SELECT
      pa.agrupador_id,
      pa.item_id,
      pa.ordem_agrupador,
      pa.ordem_item,
      a.nome        AS agrupador_nome,
      a.descricao   AS agrupador_descricao,
      i.descricao   AS item_descricao
    FROM plano_avaliacao pa
    INNER JOIN agrupadores a    ON a.id = pa.agrupador_id
    INNER JOIN itens_avaliacao i ON i.id = pa.item_id
    WHERE pa.setor_id = ?
    ORDER BY pa.ordem_agrupador ASC, pa.ordem_item ASC
  `).all(id);

  // Monta a estrutura aninhada: agrupadores com seus itens
  const agrupadoresMap = new Map();

  for (const linha of linhas) {
    if (!agrupadoresMap.has(linha.agrupador_id)) {
      agrupadoresMap.set(linha.agrupador_id, {
        id: linha.agrupador_id,
        nome: linha.agrupador_nome,
        descricao: linha.agrupador_descricao,
        itens: []
      });
    }

    agrupadoresMap.get(linha.agrupador_id).itens.push({
      id: linha.item_id,
      descricao: linha.item_descricao,
      ativo: true
    });
  }

  setor.planoDeAvaliacao = Array.from(agrupadoresMap.values());
  return setor;
}

function salvarPlano(setorId, planoDeAvaliacao) {
  const setor = db.prepare('SELECT * FROM setores WHERE id = ?').get(setorId);
  if (!setor) return null;

  //Remove Plano antigo
  db.prepare('DELETE FROM plano_avaliacao WHERE setor_id = ?').run(setorId);

  const stmt = db.prepare(`
    INSERT INTO plano_avaliacao
      (setor_id, agrupador_id, item_id, ordem_agrupador, ordem_item)
    VALUES (?, ?, ?, ?, ?)
  `);

  planoDeAvaliacao.forEach((agrupador, ordemAgrupador) => {
    (agrupador.itens ?? []).forEach((item, ordemItem) => {
      stmt.run(setorId, agrupador.id, item.id, ordemAgrupador, ordemItem);
    });
  });

  return getByIdComPlano(setorId);
}

module.exports = { getAll, getById, create, update, remove, getByIdComPlano, salvarPlano };
