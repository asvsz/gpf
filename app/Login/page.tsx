'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import ButtonOne from '../components/ButtonOne';
import FooterBar from '../components/Footer';
import HeaderBar from '../components/Header';
import { useAuth } from '../context/AuthContext';
import Input from '../components/InputText';
import Link from 'next/link';


const Login = () => {
  const router = useRouter();
  const { user} = useAuth(); // Obtem o tipo de usuário do contexto

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar se o userType (user) foi selecionado corretamente
    if (!user) {
      setErrorMessage('Tipo de usuário não selecionado. Por favor, escolha um usuário primeiro.');
      return;
    }

    try {
      // API URL baseada no tipo de usuário
      const response = await api.post(`/auth/${user}`, { email, password });

      if (response.data.access_token) {
        // Armazena o token no localStorage
        localStorage.setItem('access_token', response.data.access_token);
        alert('Login bem-sucedido!');

        // Redireciona para a página inicial com base no tipo de usuário
        if (user === 'clinician') {
          router.push('/Medico/Pacientes'); // página inicial para clínicos
        } else if (user === 'patient') {
          router.push('/Paciente/Prontuario');
        }
      }
    } catch (error) {
      // Mostra mensagem de erro se houver falha no login
      setErrorMessage('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="gap-8 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
      <HeaderBar />
      <main className="flex flex-col row-start-2 items-center sm:items-start z-0">
        <h2 className='text-3xl'>Login como {user === 'clinician' ? 'Clínico' : 'Paciente'}</h2>
        <form onSubmit={handleLogin}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
          <ButtonOne
            texto="Login"
            type="submit"
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
        <div>
          {user === 'clinician' && (
            <span>
              Se ainda não é cadastrado,{' '}
              <Link href="/CadastrarMedico" className="text-green-500">
                Cadastre-se
              </Link>
            </span>
          )}
          {user === 'patient' && (
            <span>
              Se ainda não é cadastrado,{' '}
              <Link href="/CadastrarPaciente" className="text-green-500">
                Cadastre-se
              </Link>
            </span>
          )}
        </div>
      </main>
      <FooterBar />
    </div>
  );
};

export default Login;
