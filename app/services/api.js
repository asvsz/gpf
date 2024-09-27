import axios from 'axios';

// Cria uma instância do Axios com uma configuração padrão
const api = axios.create({
  baseURL: 'https://blackwell.onrender.com', // URL base da API
  timeout: 10000, // Tempo limite para as requisições (opcional)
  headers: { 'Content-Type': 'application/json' } // Cabeçalhos padrão
});

export default api;
