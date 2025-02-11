const express = require('express');
const cors = require('cors');
const pool = require('../aura-cloth/src/db'); // Importa o pool do banco
const app = express();
const path = require('path');
const multer = require('multer'); // Importa o multer
const fs = require('fs'); // Importa o módulo fs
const nodemailer = require('nodemailer');

// Middleware para permitir CORS
app.use(cors({
  origin: '*', // Permite todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite todos os métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'] // Permite esses cabeçalhos
}));

// Middleware para processar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public', 'images')));
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

//*********************************************************************** */

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'joaopot2@gmail.com', // Seu email
    pass: 'twlr rway mtsg ntip',  // Sua senha
  },
});

// Função para enviar email
const sendEmail = async (to, subject, text) => {
  try {
      await transporter.sendMail({
          from: 'joaopot2@gmail.com',
          to,
          subject,
          text,
      });
  } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
  }
};

// Rota para listar todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
      const users = await pool.query('SELECT * FROM users');
      res.status(200).json(users.rows);
  } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Rota para obter um usuário específico pelo ID
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (user.rows.length === 0) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json(user.rows[0]);
  } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});


// Rota para atualizar um usuário
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco } = req.body;
  try {
    const userId = parseInt(id, 10); // Certifique-se de que o ID é um número inteiro
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const result = await pool.query(
      'UPDATE users SET nome = $1, telefone = $2, endereco = $3 WHERE id = $4 RETURNING *',
      [nome, telefone, endereco, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rota para enviar código de verificação para email
app.post('/api/usuarios/:id/send-email-code', async (req, res) => {
  const { id } = req.params;
  const { newEmail } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
      await pool.query('UPDATE users SET verification_code = $1 WHERE id = $2', [verificationCode, id]);
      await sendEmail(newEmail, 'Código de Verificação', `Seu código de verificação é: ${verificationCode}`);
      res.status(200).json({ message: 'Código de verificação enviado.' });
  } catch (error) {
      console.error('Erro ao enviar código de verificação:', error);
      res.status(500).json({ error: 'Erro ao enviar código de verificação.' });
  }
});

// Rota para verificar código e atualizar email
app.post('/api/usuarios/:id/verify-email', async (req, res) => {
  const { id } = req.params;
  const { newEmail, verificationCode } = req.body;

  try {
      const result = await pool.query('SELECT verification_code FROM users WHERE id = $1', [id]);

      if (result.rows[0]?.verification_code !== parseInt(verificationCode)) {
          return res.status(400).json({ error: 'Código de verificação inválido.' });
      }

      await pool.query('UPDATE users SET email = $1, verification_code = NULL WHERE id = $2', [newEmail, id]);
      res.status(200).json({ message: 'Email atualizado com sucesso!' });
  } catch (error) {
      console.error('Erro ao verificar código de email:', error);
      res.status(500).json({ error: 'Erro ao verificar código de email.' });
  }
});

// Rota para enviar código de verificação para senha
app.post('/api/usuarios/:id/send-password-code', async (req, res) => {
  const { id } = req.params;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
      await pool.query('UPDATE users SET verification_code = $1 WHERE id = $2', [verificationCode, id]);

      const result = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
      const email = result.rows[0]?.email;

      if (!email) {
          return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await sendEmail(email, 'Código de Verificação', `Seu código de verificação é: ${verificationCode}`);
      res.status(200).json({ message: 'Código de verificação enviado.' });
  } catch (error) {
      console.error('Erro ao enviar código de verificação:', error);
      res.status(500).json({ error: 'Erro ao enviar código de verificação.' });
  }
});

// Rota para verificar código e atualizar senha
app.post('/api/usuarios/:id/verify-password', async (req, res) => {
  const { id } = req.params;
  const { newPassword, verificationCode } = req.body;

  try {
    // Verifica o código de verificação no banco
    const result = await pool.query('SELECT verification_code FROM users WHERE id = $1', [id]);

    if (!result.rows[0] || result.rows[0].verification_code !== parseInt(verificationCode)) {
      return res.status(400).json({ error: 'Código de verificação inválido.' });
    }

    // Atualiza a senha sem criptografia
    await pool.query('UPDATE users SET password = $1, verification_code = NULL WHERE id = $2', [newPassword, id]);

    res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao verificar código de senha:', error);
    res.status(500).json({ error: 'Erro ao verificar código de senha.' });
  }
});

/************************************************************************* */

// Rota para criar um novo pedido
app.post('/api/orders', async (req, res) => {
  const { user_id, name, address, paymentMethod, cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => sum + item.preco * item.quantity, 0);

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, total, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [user_id, total, 'Aguardando pagamento']
    );
    const orderId = result.rows[0].id;

    for (const item of cartItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.quantity, item.preco, item.selectedSize]
      );
    }

    res.status(201).json({ message: 'Pedido criado com sucesso!', orderId });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
});

// Rota para listar todos os pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
});

// Rota para atualizar o status de um pedido
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.status(200).json({ message: 'Status do pedido atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido.' });
  }
});

// Rota para buscar um pedido específico pelo ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        include: [Product] // Inclui os produtos relacionados
      }]
    });
    
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Rota para listar pedidos de um usuário
app.get('/api/orders/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
});

//*****************************************************************************

// Rota para buscar um Usuário específico pelo ID
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userId = parseInt(id, 10); // Certifique-se de que o ID é um número inteiro
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(rows[0]); // Retorna o Usuário em formato JSON
  } catch (err) {
    console.error('Erro ao buscar Usuário:', err.message);
    res.status(500).send('Erro no servidor');
  }
});


// Rota para obter pedidos de um usuário específico
app.get('/api/pedidos', async (req, res) => {
  const { usuario_id } = req.query;
  try {
    const pedidos = await pool.query('SELECT * FROM pedidos WHERE usuario_id = $1', [usuario_id]);
    res.status(200).json(pedidos.rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Rota para obter dados de autenticação do usuário
app.get('/api/auth', async (req, res) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).send('Usuário não autenticado');
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar dados de autenticação:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

//************************************************************************************** */

// Rota para listar produtos com suporte a pesquisa
app.get('/api/produtos', async (req, res) => {
  const searchQuery = req.query.search || '';
  const areaQuery = req.query.area || '';
  try {
    let query = 'SELECT * FROM produtos WHERE 1=1';
    let values = [];
    if (searchQuery) {
      query += ' AND nome ILIKE $1';
      values.push(`%${searchQuery}%`);
    }
    if (areaQuery) {
      query += ' AND area = $2';
      values.push(areaQuery);
    }
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para listar cupons
app.get('/api/coupons', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM coupons');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar cupons:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para adicionar um novo cupom
app.post('/api/coupons', /*isAdmin,*/ async (req, res) => {
  const { code, discount } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO coupons (code, discount) VALUES ($1, $2) RETURNING *', [code, discount]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar cupom:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para remover um cupom
app.delete('/api/coupons/:id', /*isAdmin,*/ async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
    res.status(200).send('Cupom removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover cupom:', error.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para listar produtos por área
app.get('/api/produtos/area/:area', async (req, res) => {
  const { area } = req.params;
  try {
    const query = 'SELECT * FROM produtos WHERE area = $1';
    const values = [area];
    const { rows } = await pool.query(query, values);
    res.json(rows.map(row => ({
      ...row,
      preco: Number(row.preco) // Certifique-se de que preco é um número
    })));
  } catch (error) {
    console.error(`Erro ao buscar produtos da área ${area}:`, error.message);
    res.status(500).json({ error: `Erro ao buscar produtos da área ${area}` });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      preco,
      descricao,
      categoria,
      disponivel,
      image_path,
      area,
      image_path_1,
      image_path_2,
      image_path_3,
      image_path_4,
      p,
      m,
      g,
      gg
    } = req.body;

    // Verifique se todos os campos estão recebendo valores corretos do frontend
    const query = `
      UPDATE produtos
      SET
        nome = $1,
        preco = $2,
        descricao = $3,
        categoria = $4,
        disponivel = $5,
        image_path = $6,
        area = $7,
        image_path_1 = $8,
        image_path_2 = $9,
        image_path_3 = $10,
        image_path_4 = $11,
        p = $12,
        m = $13,
        g = $14,
        gg = $15
      WHERE id = $16
      RETURNING *
    `;

    const values = [
      nome,
      preco,
      descricao,
      categoria,
      disponivel,
      image_path,
      area,
      image_path_1,
      image_path_2,
      image_path_3,
      image_path_4,
      p,
      m,
      g,
      gg,
      id
    ];

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.get('/api/images', (req, res) => {
  // Ajuste conforme a estrutura real do seu projeto (por exemplo, "public/images")
  const imagesDir = path.join(__dirname, 'imagens/images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Erro ao listar imagens:', err);
      return res.status(500).json({ error: 'Erro ao listar imagens' });
    }
    const images = files.map(file => 'images/' + file);
    res.json(images);
  });
});

// Rota para buscar um produto específico pelo ID
app.get('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Busca o produto no banco de dados pelo ID
    const { rows } = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(rows[0]); // Retorna o produto em formato JSON
  } catch (err) {
    console.error('Erro ao buscar produto:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para listar banners
app.get('/api/banners', async (req, res) => {
  const { location } = req.query;
  try {
    const query = location ? 'SELECT * FROM banners WHERE location = $1' : 'SELECT * FROM banners';
    const values = location ? [location] : [];
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar banners:', error.message);
    res.status(500).json({ error: 'Erro ao buscar banners' });
  }
});

// Rota para registrar usuário
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Validação simples
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e senha são obrigatórios!' });
  }

  try {
    // Inserir usuário no banco
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    console.log('Usuário registrado:', result.rows[0]);
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao realizar o cadastro.' });
  }
});

// Middleware para verificar se o usuário é administrador
const isAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).send('Usuário não autenticado');
  }

  try {
    const { rows } = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    if (rows.length === 0 || !rows[0].is_admin) {
      return res.status(403).send('Acesso negado');
    }
    next();
  } catch (error) {
    console.error('Erro ao verificar administrador:', error.message);
    res.status(500).send('Erro no servidor');
  }
};

app.get('/api/is-admin', async (req, res) => {
  const userId = req.headers['user-id'];
  console.log('user-id recebido:', userId); // Log para depuração

  if (!userId) {
    return res.status(400).json({ error: 'user-id é obrigatório no cabeçalho' });
  }

  try {
    const query = 'SELECT is_admin FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [userId]);

    if (rows.length > 0) {
      res.status(200).json({ isAdmin: rows[0].is_admin });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao verificar status de administrador:', error.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const values = [username, password];

    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      console.log('Usuário logado:', rows[0]);
      const user = rows[0];
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          nome: user.nome,
          telefone: user.telefone,
          endereco: user.endereco,
          isAdmin: user.is_admin,
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ success: false, error: 'Erro no servidor' });
  }
});

//___________________________________________________________________

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagens/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint para upload de arquivos
app.post('/api/upload', upload.single('produtoFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  res.send({ filePath: `/imagens/images/${req.file.filename}` });
});

//___________________________________________________________________

// Rota para listar imagens
app.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, '/images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Erro ao listar imagens:', err);
      return res.status(500).json({ error: 'Erro ao listar imagens' });
    }
    const images = files.map(file => 'images/' + file);
    res.json(images);
  });
});

// Rota para listar imagens disponíveis
app.get('/api/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'imagens/images');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Erro ao listar imagens:', err);
      res.status(500).json({ error: 'Erro ao listar imagens' });
      return;
    }
    res.json(files);
  });
});

// Rota para listar produtos com suporte a pesquisa
app.get('/api/produtos', async (req, res) => {
  const searchQuery = req.query.search || '';
  const areaQuery = req.query.area || '';
  try {
    let query = 'SELECT * FROM produtos WHERE 1=1';
    let values = [];
    if (searchQuery && areaQuery) {
      query += ' AND nome ILIKE $1 AND area = $2';
      values.push(`%${searchQuery}%`, areaQuery);
    } else if (searchQuery) {
      query += ' AND nome ILIKE $1';
      values.push(`%${searchQuery}%`);
    } else if (areaQuery) {
      query += ' AND area = $1';
      values.push(areaQuery);
    }
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para adicionar um novo produto
app.post('/api/produtos', async (req, res) => {
  const { nome, preco, image_path, image_path_1, image_path_2, image_path_3, image_path_4, p, m, g, gg } = req.body;
  try {
    const query = `
      INSERT INTO produtos (nome, preco, image_path, image_path_1, image_path_2, image_path_3, image_path_4, p, m, g, gg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
    `;
    const values = [nome, preco, image_path, image_path_1, image_path_2, image_path_3, image_path_4, p, m, g, gg];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
});

//nome = $1,preco = $2,descricao = $3,categoria = $4,disponivel = $5
//,image_path = $6,area = $7,image_path_1 = $8,image_path_2 = $9,
//image_path_3 = $10,image_path_4 = $11,p = $12,m = $13,g = $14,gg = $15

// Rota para editar um produto
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, categoria, disponivel, image_path, area, image_path_1, image_path_2, image_path_3, image_path_4, p, m, g, gg } = req.body;
  try {
    const query = `
      UPDATE produtos
      SET nome = $1, preco = $2,descricao = $3,categoria = $4,disponivel = $5, image_path = $6,area = $7,image_path_1 = $8,image_path_2 = $9, image_path_3 = $10,image_path_4 = $11,p = $12,m = $13,g = $14,gg = $15
      WHERE id = $16
      RETURNING *
    `;
    const values = [nome, preco, descricao, categoria, disponivel, image_path, area, image_path_1, image_path_2, image_path_3, image_path_4, p, m, g, gg, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao editar produto:', error.message);
    res.status(500).json({ error: 'Erro ao editar produto' });
  }
});

// Rota para apagar um produto
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ success: true, produto: rows[0] });
  } catch (error) {
    console.error('Erro ao remover produto:', error.message);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

// Rota para adicionar banners
app.post('/api/banners', async (req, res) => {
  const { nome, image_path, location } = req.body;
  try {
    const query = `
      INSERT INTO banners (nome, image_path, location)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [nome, image_path, location];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar banner:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar banner' });
  }
});

//deleta o banner
app.delete('/api/banners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM banners WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }
    res.json({ success: true, banner: rows[0] });
  } catch (error) {
    console.error('Erro ao remover banner:', error.message);
    res.status(500).json({ error: 'Erro ao remover banner' });
  }
});

//rota para editar banner
app.put('/api/banners/:id', async (req, res) => {
  try {
    const { nome, image_path, location } = req.body;
    const { id } = req.params;
    const query = `
      UPDATE banners
      SET nome = $1, image_path = $2, location = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [nome, image_path, location, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao editar banner:', error);
    res.status(500).json({ error: 'Erro ao editar banner' });
  }
});

// Rota para listar bannersposts
app.get('/api/posts', async (req, res) => {
  const { location } = req.query;
  try {
    const query = location ? 'SELECT * FROM posts WHERE location = $1' : 'SELECT * FROM posts';
    const values = location ? [location] : [];
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error.message);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Rota para adicionar bannersposts
app.post('/api/posts', async (req, res) => {
  const { image_path, location, nome } = req.body;
  try {
    const query = `
      INSERT INTO posts (image_path, location, nome)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [image_path, location, nome];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar posts:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar post' });
  }
});

//rota para editar bannerpost
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { nome, image_path, location } = req.body;
    const { id } = req.params;
    const query = `
      UPDATE posts
      SET nome = $1, image_path = $2, location = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [nome, image_path, location, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao editar post:', error);
    res.status(500).json({ error: 'Erro ao editar post' });
  }
});

//deleta o bannerposts
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'post não encontrado' });
    }
    res.json({ success: true, post: rows[0] });
  } catch (error) {
    console.error('Erro ao remover post:', error.message);
    res.status(500).json({ error: 'Erro ao remover post' });
  }
});

// Rota para listar pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pedidos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Rota para atualizar o status do pedido
app.put('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const query = 'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *';
    const values = [status, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// Porta do servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});