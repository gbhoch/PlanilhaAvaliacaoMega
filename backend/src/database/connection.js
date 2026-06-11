// Importa o driver do SQLite
const Database = require('better-sqlite3');

// Importa o módulo 'path' do Node para montar caminhos de arquivo
// de forma segura em qualquer sistema operacional
const path = require('path');

// Monta o caminho absoluto para o arquivo do banco de dados
// __dirname = pasta atual (src/database)
// '../..' = sobe duas pastas (até backend/)
// 'database/app.db' = caminho do arquivo
const dbPath = path.join(__dirname, '..', '..', 'database', 'app.db');
console.log('Caminho do banco:', dbPath);

// Abre (ou cria) o banco de dados
// Se o arquivo não existir, o better-sqlite3 cria automaticamente
const db = new Database(dbPath, {
  //verbose: console.log  // ← descomente para ver todas as queries SQL no terminal
});

// Ativa o modo WAL (Write-Ahead Logging)
// Isso melhora a performance em leituras e escritas simultâneas
// db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

console.log('Banco de dados conectado em:', dbPath);

// Exporta a conexão para ser usada em outros arquivos
module.exports = db;
