import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Importa o arquivo CSS

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Produto adicionado com sucesso!');
    } catch (error) {
      setMessage('Erro ao adicionar produto.');
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-title">Adicionar Produto</h1>
      <form className="add-product-form" onSubmit={handleAddProduct}>
        <div className="add-product-form-group">
          <label htmlFor="name">Nome do Produto</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="add-product-form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="add-product-form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="add-product-form-group">
          <label htmlFor="image">Imagem</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        {message && <p className="add-product-message">{message}</p>}
        <button type="submit" className="add-product-button">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AddProduct;