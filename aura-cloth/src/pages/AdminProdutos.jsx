import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProdutos.css';

const AdminProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [images, setImages] = useState([]);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    categoria: '',
    disponivel: '',
    image_path: '',
    area: '',
    image_path_1: '',
    image_path_2: '',
    image_path_3: '',
    image_path_4: '',
    p: '',
    m: '',
    g: '',
    gg: ''
  });

  const [editProduto, setEditProduto] = useState(null);
  const [produtoFile, setProdutoFile] = useState(null);
  const [produtoFile1, setProdutoFile1] = useState(null);
  const [produtoFile2, setProdutoFile2] = useState(null);
  const [produtoFile3, setProdutoFile3] = useState(null);
  const [produtoFile4, setProdutoFile4] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        window.alert('Erro ao buscar produtos: ' + error.message);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        window.alert('Erro ao buscar imagens: ' + error.message);
      }
    };
    fetchImages();
  }, []);

//teste antes da merda

//teste 2 antes da merda

const handleUploadFile = async (file) => {
  const formData = new FormData();
  formData.append('produtoFile', file);

  try {
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.filePath; // Supondo que o servidor retorna o caminho do arquivo
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    window.alert('Erro ao fazer upload da imagem: ' + error.message);
    throw error;
  }
};

const handleAddProduto = async (e) => {
  e.preventDefault();
    try {
      // Faz o upload dos arquivos se existirem
      const uploadedPath = await handleUploadFile(produtoFile);
      const uploadedPath1 = produtoFile1 ? await handleUploadFile(produtoFile1) : '';
      const uploadedPath2 = produtoFile2 ? await handleUploadFile(produtoFile2) : '';
      const uploadedPath3 = produtoFile3 ? await handleUploadFile(produtoFile3) : '';
      const uploadedPath4 = produtoFile4 ? await handleUploadFile(produtoFile4) : '';
      if (!uploadedPath) return;

      const produtoToSave = {
        ...newProduto,
        image_path: uploadedPath,
        image_path_1: uploadedPath1,
        image_path_2: uploadedPath2,
        image_path_3: uploadedPath3,
        image_path_4: uploadedPath4
      };

      const response = await axios.post('http://localhost:5000/api/produtos', produtoToSave);
      setProdutos([...produtos, response.data]);
      setNewProduto({
        nome: '',
        preco: '',
        descricao: '',
        categoria: '',
        disponivel: '',
        image_path: '',
        area: '',
        image_path_1: '',
        image_path_2: '',
        image_path_3: '',
        image_path_4: '',
        p: '',
        m: '',
        g: '',
        gg: ''
      });
      setProdutoFile(null);
      setProdutoFile1(null);
      setProdutoFile2(null);
      setProdutoFile3(null);
      setProdutoFile4(null);

      // Alerta de sucesso
      window.alert('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      window.alert('Erro ao adicionar produto: ' + error.message);
    }
  };

  // Remove um produto
  const handleRemoveProduto = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que quer apagar este produto?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/produtos/${id}`);
      setProdutos(produtos.filter((produto) => produto.id !== id));
      window.alert('Produto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      window.alert('Erro ao remover produto: ' + error.message);
    }
  };

    // Inicia a edição de um produto
  const startEditProduto = (produto) => {
    setEditProduto({
      ...produto,
      descricao: produto.descricao || '',
      categoria: produto.categoria || '',
      area: produto.area || '',
      nome: produto.nome || '',
      preco: produto.preco || '',
      p: produto.p || '',
      m: produto.m || '',
      g: produto.g || '',
      gg: produto.gg || '',
      disponivel: produto.disponivel || '',
      // Garantir que as imagens fiquem definidas
      image_path: produto.image_path || '',
      image_path_1: produto.image_path_1 || '',
      image_path_2: produto.image_path_2 || '',
      image_path_3: produto.image_path_3 || '',
      image_path_4: produto.image_path_4 || ''
    });
  };

    // Cancela a edição
  const cancelEdit = () => {
    setEditProduto(null);
  };

  const handleSaveEdit = async () => {
    try {
      // Caso existam arquivos, faz upload e substitui o valor de editProduto.image_path
      const uploadedPath = produtoFile ? await handleUploadFile(produtoFile) : editProduto.image_path;
      const uploadedPath1 = produtoFile1 ? await handleUploadFile(produtoFile1) : editProduto.image_path_1;
      const uploadedPath2 = produtoFile2 ? await handleUploadFile(produtoFile2) : editProduto.image_path_2;
      const uploadedPath3 = produtoFile3 ? await handleUploadFile(produtoFile3) : editProduto.image_path_3;
      const uploadedPath4 = produtoFile4 ? await handleUploadFile(produtoFile4) : editProduto.image_path_4;

      const editData = {
        // garantimos todos os campos
        nome: editProduto.nome,
        preco: editProduto.preco,
        tamanhos: editProduto.tamanhos,
        descricao: editProduto.descricao,
        categoria: editProduto.categoria,
        area: editProduto.area,
        disponivel: editProduto.disponivel || false, // Converte 'sim'/'nao' para boolean
        p: editProduto.p || false, // Garante que seja booleano
        m: editProduto.m || false,
        g: editProduto.g || false,
        gg: editProduto.gg || false,
        image_path: uploadedPath,
        image_path_1: uploadedPath1,
        image_path_2: uploadedPath2,
        image_path_3: uploadedPath3,
        image_path_4: uploadedPath4
      };

      const response = await axios.put(`http://localhost:5000/api/produtos/${editProduto.id}`, editData);
      setProdutos(produtos.map((p) => (p.id === editProduto.id ? response.data : p)));

      // limpa estado
      setEditProduto(null);
      setProdutoFile(null);
      setProdutoFile1(null);
      setProdutoFile2(null);
      setProdutoFile3(null);
      setProdutoFile4(null);

      // Alerta de sucesso
      window.alert('Produto editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      window.alert('Erro ao editar produto: ' + error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Administração de Produtos</h1>

      {/* Formulário para adicionar novo produto */}
      <div className="admin-section">
        <h2>Adicionar Novo Produto</h2>
        <div className="admin-form">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={newProduto.nome}
            onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
          />
          <input
            type="number"
            placeholder="Preço"
            value={newProduto.preco}
            onChange={(e) => setNewProduto({ ...newProduto, preco: e.target.value })}
          />
          <textarea
            placeholder="Descrição"
            value={newProduto.descricao}
            onChange={(e) => setNewProduto({ ...newProduto, descricao: e.target.value })}
          />
          <select
            value={newProduto.categoria}
            onChange={(e) => setNewProduto({ ...newProduto, categoria: e.target.value })}
          >
            <option value="">Selecione a Categoria</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
          <select
            value={newProduto.area}
            onChange={(e) => setNewProduto({ ...newProduto, area: e.target.value })}
            required
          >
            <option value="">Selecione a Área</option>
            <option value="promo">Promoções</option>
            <option value="geek">Geek</option>
            <option value="lancamentos">Lançamentos</option>
            <option value="university">Universidade</option>
            <option value="fit">Fit</option>
            <option value="alternativo">Alternativo</option>
          </select>

          {/* Campo de disponibilidade */}
  <label>
    <input
      type="checkbox"
      checked={newProduto.disponivel || false}
      onChange={(e) => setNewProduto({ ...newProduto, disponivel: e.target.checked })}
    />
    Disponivel
  </label>

  {/* Campos para os tamanhos (booleanos) */}
  <label>
    <input
      type="checkbox"
      checked={newProduto.p || false}
      onChange={(e) => setNewProduto({ ...newProduto, p: e.target.checked })}
    />
    Tamanho P
  </label>
  <label>
    <input
      type="checkbox"
      checked={newProduto.m || false}
      onChange={(e) => setNewProduto({ ...newProduto, m: e.target.checked })}
    />
    Tamanho M
  </label>
  <label>
    <input
      type="checkbox"
      checked={newProduto.g || false}
      onChange={(e) => setNewProduto({ ...newProduto, g: e.target.checked })}
    />
    Tamanho G
  </label>
  <label>
    <input
      type="checkbox"
      checked={newProduto.gg || false}
      onChange={(e) => setNewProduto({ ...newProduto, gg: e.target.checked })}
    />
    Tamanho GG
  </label>

          {/* Upload de cada imagem */}
          <label>Imagem Principal:</label>
          <input
            type="file"
            onChange={(e) => setProdutoFile(e.target.files[0])}
            required
            />
          <input
            type="file"
            onChange={(e) => setProdutoFile1(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setProdutoFile2(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setProdutoFile3(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setProdutoFile4(e.target.files[0])}
          />

          {/* Selecionar imagem existente (opcional) */}
          <select
            value={newProduto.image_path || ''}
            onChange={(e) => setNewProduto({ ...newProduto, image_path: e.target.value })}
          >
            <option value="">(Opcional) Escolher imagem já existente p/ principal</option>
            {images.map((img) => (
              <option key={img} value={img}>{img}</option>
            ))}
          </select>

          <button onClick={handleAddProduto}>Adicionar Produto</button>
        </div>
      </div>

      {/* Listagem de produtos */}
      <div className="admin-section">
        <h2>Produtos</h2>
        <div className="products-list">
          {produtos.map((produto) => (
            <div key={produto.id} className="product-item">
              {editProduto && editProduto.id === produto.id ? (

                // Formulário de edição
                <div className="edit-form">
                  <input
                    type="text"
                    value={editProduto.nome}
                    onChange={(e) => setEditProduto({ ...editProduto, nome: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editProduto.preco}
                    onChange={(e) => setEditProduto({ ...editProduto, preco: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editProduto.descricao}
                    onChange={(e) => setEditProduto({ ...editProduto, descricao: e.target.value })}
                  />
                  <select
                    value={editProduto.categoria}
                    onChange={(e) => setEditProduto({ ...editProduto, categoria: e.target.value })}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                  <select
                    value={editProduto.area}
                    onChange={(e) => setEditProduto({ ...editProduto, area: e.target.value })}
                  >
                    <option value="promo">Promoções</option>
                    <option value="geek">Geek</option>
                    <option value="lancamentos">Lançamentos</option>
                    <option value="university">Universidade</option>
                    <option value="fit">Fit</option>
                    <option value="alternativo">Alternativo</option>
                  </select>

                  {/* Campo de disponibilidade */}
        <label>
      <input
        type="checkbox"
        checked={editProduto.disponivel || false}
        onChange={(e) => setEditProduto({ ...editProduto, disponivel: e.target.checked })}
      />
      Disponível
    </label>

    {/* Campos para os tamanhos (booleanos) */}
    <label>
      <input
        type="checkbox"
        checked={editProduto.p || false}
        onChange={(e) => setEditProduto({ ...editProduto, p: e.target.checked })}
      />
      Tamanho P
    </label>
    <label>
      <input
        type="checkbox"
        checked={editProduto.m || false}
        onChange={(e) => setEditProduto({ ...editProduto, m: e.target.checked })}
      />
      Tamanho M
    </label>
    <label>
      <input
        type="checkbox"
        checked={editProduto.g || false}
        onChange={(e) => setEditProduto({ ...editProduto, g: e.target.checked })}
      />
      Tamanho G
    </label>
    <label>
      <input
        type="checkbox"
        checked={editProduto.gg || false}
        onChange={(e) => setEditProduto({ ...editProduto, gg: e.target.checked })}
      />
      Tamanho GG
    </label>

                  {/* Upload de imagens ao editar (opcional) */}
                  <input
                    type="file"
                    onChange={(e) => setProdutoFile(e.target.files[0])}
                  />
                  <input
                    type="file"
                    onChange={(e) => setProdutoFile1(e.target.files[0])}
                  />
                  <input
                    type="file"
                    onChange={(e) => setProdutoFile2(e.target.files[0])}
                  />
                  <input
                    type="file"
                    onChange={(e) => setProdutoFile3(e.target.files[0])}
                  />
                  <input
                    type="file"
                    onChange={(e) => setProdutoFile4(e.target.files[0])}
                  />

                  {/* Selecionar imagem existente (opcional) */}
                  <select
                    value={editProduto.image_path || ''}
                    onChange={(e) => setEditProduto({ ...editProduto, image_path: e.target.value })}
                  >
                    <option value="">(Opcional) Escolher imagem p/ principal</option>
                    {images.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>

                  <select
                    value={editProduto.image_path_1 || ''}
                    onChange={(e) => setEditProduto({ ...editProduto, image_path_1: e.target.value })}
                  >
                    <option value="">(Opcional) Imagem adicional</option>
                    {images.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>

                  <select
                    value={editProduto.image_path_2 || ''}
                    onChange={(e) => setEditProduto({ ...editProduto, image_path_2: e.target.value })}
                  >
                    <option value="">(Opcional) Imagem adicional</option>
                    {images.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>

                  <select
                    value={editProduto.image_path_3 || ''}
                    onChange={(e) => setEditProduto({ ...editProduto, image_path_3: e.target.value })}
                  >
                    <option value="">(Opcional) Imagem adicional</option>
                    {images.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>

                  <select
                    value={editProduto.image_path_4 || ''}
                    onChange={(e) => setEditProduto({ ...editProduto, image_path_4: e.target.value })}
                  >
                    <option value="">(Opcional) Imagem adicional</option>
                    {images.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>

                  <button onClick={handleSaveEdit}>Salvar</button>
                  <button onClick={cancelEdit}>Cancelar</button>
                </div>
              ) : (
                // Visualização normal
                <>
                  <img
                    src={`http://localhost:5000/imagens/${produto.image_path}`}
                    alt={produto.nome}
                    className="product-image"
                  />
                  <p>{produto.nome}</p>
                  <p>R$ {Number(produto.preco).toFixed(2)}</p>
                  <p>Disponível: {produto.disponivel && <li>Esta Disponível</li>}</p>
    <p>Tamanhos disponíveis:</p>
    <ul>
      {produto.p && <li>P</li>}
      {produto.m && <li>M</li>}
      {produto.g && <li>G</li>}
      {produto.gg && <li>GG</li>}
    </ul>
                  <button onClick={() => startEditProduto(produto)}>Editar</button>
                  <button onClick={() => handleRemoveProduto(produto.id)}>Remover</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProdutos;