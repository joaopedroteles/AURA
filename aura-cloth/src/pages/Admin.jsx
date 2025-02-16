import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [banners, setBanners] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [editBanner, setEditBanner] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image_path: '', location: '', nome: '' });
  const locations = ['home', 'produtos', 'Footer', 'universidade', 'lancamentos', 'geek', 'productDetail', 'fit', 'alternativos', 'Promos'];
  const navigate = useNavigate();
  const [/*products*/, setProducts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });
  const [newBanner, setNewBanner] = useState({ nome: '', image_path: '', location: '' // "home", "about", "pagproduto", etc.
});

  //const [orders, setOrders] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  //const [editingOrder, setEditingOrder] = useState(null);
  //const [newStatus, setNewStatus] = useState('')

/********************************************************************************************* */

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/posts', newPost);
      setPosts([...posts, response.data]);
      setNewPost({ image_path: '', location: '', nome: '' });
    } catch (error) {
      console.error('Erro ao adicionar post:', error);
    }
  };
  
  /*useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
      setEditingOrder(null);
      setNewStatus('');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };*/

  //prepara edição
  const startEditPost = (post) => {
    setEditingPost(post);
    setNewPost(post);
  };

  // Cancela edição
  const cancelEditP = () => {
    setEditingPost(null);
  };

// Salva edição
const handleSaveEditP = async () => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/posts/${editingPost.id}`,
      editingPost
    );
    setPosts(
      posts.map((b) => (b.id === editingPost.id ? response.data : b))
    );
    setEditingPost(null);
  } catch (error) {
    console.error('Erro ao editar post:', error);
  }
}; 

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Erro ao buscar os seus banners:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchAvailableImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      setAvailableImages(response.data);
    } catch (error) {
      console.error('Erro ao buscar imagens disponíveis:', error);
    }
  };

//********************************************************************************************** */
  // Adiciona um banner
  const handleAddBanner = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/banners', newBanner);
      setBanners([...banners, response.data]);
      setNewBanner({ nome: '', image_path: '', location: '' });
    } catch (error) {
      console.error('Erro ao adicionar banner:', error);
    }
  };

  // Remove um banner
  const handleRemoveBanner = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/banners/${id}`);
      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (error) {
      console.error('Erro ao remover banner:', error);
    }
  };

  // Prepara edição
  const startEditBanner = (banner) => {
    setEditBanner(banner);
  };

  // Cancela edição
  const cancelEdit = () => {
    setEditBanner(null);
  };

// Salva edição
const handleSaveEdit = async () => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/banners/${editBanner.id}`,
      editBanner
    );
    setBanners(
      banners.map((b) => (b.id === editBanner.id ? response.data : b))
    );
    setEditBanner(null);
  } catch (error) {
    console.error('Erro ao editar banner:', error);
  }
};

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/banners');
        setBanners(response.data);
      } catch (error) {
        console.error('Erro ao buscar estes banners:', error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/coupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('Erro ao buscar cupons:', error);
      }
    };

    fetchCoupons();
  }, []);
  
  const handleAddCoupon = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/coupons', newCoupon, {
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
      setCoupons([...coupons, response.data]);
      setNewCoupon({ code: '', discount: '' });
    } catch (error) {
      console.error('Erro ao adicionar cupom:', error);
    }
  };

  const handleRemoveCoupon = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
      setCoupons(coupons.filter(coupon => coupon.id !== id));
    } catch (error) {
      console.error('Erro ao remover cupom:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };


  const handleUploadImage = async () => {
    if (!bannerFile) return;
    const formData = new FormData();
    formData.append('image', bannerFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Imagem enviada com sucesso!');
      setBannerFile(null);
      fetchAvailableImages();
      return response.data.image_path;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem: ' + error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    fetchAvailableImages();
  }, []);
  

  return (
    <div className="admin-container">
      <h1 className="admin-title">Administração</h1>
      <div className="admin-container">
        <div className="coupons-section">
          <h2>Cupons de Desconto</h2>
          <div className="coupons-list">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="coupon-item">
                <p>Código: {coupon.code}</p>
                <p>Desconto: {coupon.discount}%</p>
                <button onClick={() => handleRemoveCoupon(coupon.id)}>Remover</button>
              </div>
            ))}
          </div>
          <div className="add-coupon">
            <input
              type="text"
              placeholder="Código do Cupom"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            />
            <input
              type="number"
              placeholder="Desconto (%)"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
            />
            <button onClick={handleAddCoupon}>Adicionar Cupom</button>
          </div>
        </div>
        <div className="admin-section">
          <h2>Gerenciar Produtos</h2>
          <button onClick={() => navigate('/admin-produtos')}>Ir para Administração de Produtos</button>
        </div>
        <div className="admin-section">
          
        <h1>Administração de Pedidos</h1>
        <button onClick={() => navigate('/admin/orders/:id')}>
            Ver Detalhes dos Pedidos
          </button>
        </div>
      </div>

      <h2>Posts</h2>
      {/* Adicionar Banner */}
      <div className="admin-section">
        <h2>Adicionar Novo Post</h2>
        <div className="admin-form">
        <select
            value={newPost.image_path}
            onChange={(e) => setNewPost({ ...newPost, image_path: e.target.value })}
          >
            <option value="">Selecione uma Imagem</option>
            {availableImages.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
          <select
            value={newPost.location}
            onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
          >
            <option value="">Selecione a Página</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome"
            value={newPost.nome}
            onChange={(e) => setNewPost({ ...newPost, nome: e.target.value })}
          />
          <button onClick={handleAddPost}>Adicionar Post</button>
        </div>
      </div>

      {/* Listar/Editar/Excluir Posts por Página */}
      {locations.map((loc) => (
        <div className="admin-section" key={loc}>
          <h2>Posts da página: {loc}</h2>
          <div className="banners-list">
            {posts
              .filter((post) => post.location === loc)
              .map((post) => (
                <div key={post.id} className="banner-item">
                  {editingPost && editingPost.id === post.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editingPost.image_path}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, image_path: e.target.value })
                        }
                      />
                      <select
                        value={editingPost.location}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, location: e.target.value })
                        }
                      >
                        {locations.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={editingPost.nome}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, nome: e.target.value })
                        }
                      />
                      <button onClick={handleSaveEditP}>Salvar</button>
                      <button onClick={cancelEditP}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <img
                        src={`http://localhost:5000/imagens/${post.image_path}`}
                        alt={post.nome}
                        className="banner-image"
                      />
                      <p>{post.nome}</p>
                      <p>Página: {post.location}</p>
                      <button onClick={() => startEditPost(post)}>Editar</button>
                      <button onClick={() => handleDeletePost(post.id)}>Remover</button>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Adicionar Banner */}
      <div className="admin-section">
        <h2>Adicionar Novo Banner</h2>
        <div className="admin-form">
          <input
            type="text"
            placeholder="Nome"
            value={newBanner.nome}
            onChange={(e) => setNewBanner({ ...newBanner, nome: e.target.value })}
          />
          <select
            value={newBanner.image_path}
            onChange={(e) => setNewBanner({ ...newBanner, image_path: e.target.value })}
          >
            <option value="">Selecione uma Imagem</option>
            {availableImages.map((image) => (
              <option key={image} value={image}>{image}</option>
            ))}
          </select>
          <select
            value={newBanner.location}
            onChange={(e) => setNewBanner({ ...newBanner, location: e.target.value })}
          >
            <option value="">Selecione a Página</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <button onClick={handleAddBanner}>Adicionar Banner</button>
        </div>
      </div>

      {/* Upload de Imagem */}
      <div className="admin-section">
        <h2>Upload de Imagem</h2>
        <div className="admin-form">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadImage}>Enviar Imagem</button>
        </div>
      </div>

      {/* Listar/Editar/Excluir Banners por Página */}
      {locations.map((loc) => (
        <div className="admin-section" key={loc}>
          <h2>Banners da página: {loc}</h2>
          <div className="banners-list">
            {banners
              .filter((banner) => banner.location === loc)
              .map((banner) => (
                <div key={banner.id} className="banner-item">
                  {editBanner && editBanner.id === banner.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editBanner.nome}
                        onChange={(e) =>
                          setEditBanner({ ...editBanner, nome: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        value={editBanner.image_path}
                        onChange={(e) =>
                          setEditBanner({ ...editBanner, image_path: e.target.value })
                        }
                      />
                      <select
                        value={editBanner.location}
                        onChange={(e) =>
                          setEditBanner({ ...editBanner, location: e.target.value })
                        }
                      >
                        {locations.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <button onClick={handleSaveEdit}>Salvar</button>
                      <button onClick={cancelEdit}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <img
                        src={`http://localhost:5000/imagens/${banner.image_path}`}
                        alt={banner.nome}
                        className="banner-image"
                      />
                      <p>{banner.nome}</p>
                      <p>Página: {banner.location}</p>
                      <button onClick={() => startEditBanner(banner)}>Editar</button>
                      <button onClick={() => handleRemoveBanner(banner.id)}>Remover</button>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default Admin;