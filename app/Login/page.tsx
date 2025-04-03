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
import Image from "next/image";
import Logo from "@/app/Logotipo GPF.svg";


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
        // Armazene o e-mail no localStorage
        localStorage.setItem('user_email', email);

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
      <div className="min-h-screen p-8 pb-20 sm:p-20 flex flex-col bg-gray-100">
        <HeaderBar/>
        <div className="flex flex-grow items-center justify-center">
          {/* Logo à esquerda */}
          <div className="flex-shrink-0 w-1/2"> {/* Ajuste a largura conforme necessário */}
            <Image src={Logo} alt="logo" width={700} height={100}/>
          </div>

          {/* Conteúdo do login à direita */}
          <div className="flex flex-col justify-center items-center space-y-6 w-2/2"> {/* Ajuste a largura conforme necessário */}
            <h2 className='font-bold pb-10 text-4xl text-custom-green'>
              Login como {user === 'clinician' ? 'Fisioterapeuta' : 'Paciente'}
            </h2>
            <form onSubmit={handleLogin} className="w-full max-w-md"> {/* Limite a largura do formulário */}
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
              <div className="flex justify-center">
                <ButtonOne
                    texto="Entrar"
                    type="submit"
                />
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
            <div className="pt-4">
              {user === 'clinician' && (
                  <span>
                        <Link href="/CadastrarMedico"
                              className="underline decoration-solid font-bold text-2xl text-custom-green">
                            Cadastre-se
                        </Link>
                    </span>
              )}
              {user === 'patient' && (
                  <span>
                        <Link href="/CadastrarPaciente" className="underline decoration-solid font-bold text-2xl text-custom-green">
                            Cadastre-se
                        </Link>
                    </span>
              )}
            </div>
          </div>
        </div>
        <FooterBar/>
      </div>


  );
};

export default Login;
