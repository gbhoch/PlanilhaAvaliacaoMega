// Importa conexão já configurada
const db = require('./connection');

function initDatabase(){
  console.log('Inicializando tabelas do banco de dados...');

  // Executa múltiplas criações dentro de uma transação
  // Transação = ou tudo funciona, ou nada é salvo (atomicidade)
  const init = db.transaction(() => {

    // ---- TABELA: setores ----
    // Armazena os setores da empresa (ex: Clicheria, Gerência, TI)
    db.exec(`
      CREATE TABLE IF NOT EXISTS setores (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nome        TEXT    NOT NULL,
        descricao   TEXT    DEFAULT '',
        ativo       INTEGER DEFAULT 1,
        criado_em   TEXT    DEFAULT (datetime('now'))
      )
    `);
    //console.log('Tabela setores OK');

    // ---- TABELA: agrupadores ----
    // Armazena os sensos/agrpadores (ex: Senso de Organização)
    db.exec(`
      CREATE TABLE IF NOT EXISTS agrupadores (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nome        TEXT    NOT NULL,
        descricao   TEXT    DEFAULT '',
        ativo       INTEGER DEFAULT 1,
        criado_em   TEXT    DEFAULT (datetime('now'))
      )
    `);
    //console.log('Tabela agrupadores OK');

    // ---- TABELA: itens_avaliacao ----
    // Itens que pertencem a um agrupador
    // agrupador_id é uma CHAVE ESTRANGEIRA - aponta para agrupadores.id
    db.exec(`
      CREATE TABLE IF NOT EXISTS itens_avaliacao (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        agrupador_id  INTEGER NOT NULL,
        descricao     TEXT    NOT NULL,
        ativo         INTEGER DEFAULT 1,
        criado_em     TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (agrupador_id) REFERENCES agrupadores(id)
      )
    `);
    //console.log('Tabela itens_avaliacao OK');

    // ---- TABELA: plano_avaliacao ----
    // Relaciona um setor com seus agrupadores configurados
    // É uma tabela de relacionamento N:N entre setores e agrupadores
    db.exec(`
      CREATE TABLE IF NOT EXISTS plano_avalicao(
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        setor_id     INTEGER NOT NULL,
        agrupador_id INTEGER NOT NULL,
        ordem        INTEGER DEFAULT 0,
        FOREIGN KEY (setor_id)     REFERENCES setores(id),
        FOREIGN KEY (agrupador_id) REFERENCES agrupadores(id)
      )
    `);
    //console.log('Tabela plano_avaliacao OK');

    // ---- TABELA: avaliacoes ----
    // Cabeçalho de cada avaliação realizada
    db.exec(`
      CREATE TABLE IF NOT EXISTS avaliacoes (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        setor_id       INTEGER NOT NULL,
        nome_avaliador TEXT    NOT NULL,
        data_avaliacao TEXT    NOT NULL,
        media_geral    REAL    DEFAULT 0,
        criado_em      TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (setor_id) REFERENCES setores(id)
      )
    `);
    //console.log('Tabela avaliacoes OK');

    // ---- TABELA: itens_avaliados ----
    // Detalhe de cada item avaliado dentro de uma avaliação
    db.exec(`
      CREATE TABLE IF NOT EXISTS itens_avaliados (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        avaliacao_id   INTEGER NOT NULL,
        agrupador_nome TEXT    NOT NULL,
        item_descricao TEXT    NOT NULL,
        nota           REAL    NOT NULL,
        anotacao       TEXT    DEFAULT '',
        FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id)
      )
    `);
    //console.log('Tabela itens_avaliados OK');
  });

  init();

  console.log('Tabelas criadas/verificadas com sucesso!');
}

module.exports = { initDatabase };
