const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // Seu usuário do PostgreSQL
  host: 'localhost',      // Servidor (localhost para local)
  database: 'aurabase', // Nome do banco criado
  password: '98271002',  // A senha definida
  port: 5432,             // Porta padrão do PostgreSQL
});

module.exports = pool;
