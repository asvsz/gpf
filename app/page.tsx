'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext'; // Importa o contexto de autenticação

const TipoUsuario: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth(); // Obtém a função de login do contexto

  const handleUserTypeSelection = (userType: 'patient' | 'clinician') => {
    // Realiza o login (armazenando o tipo de usuário)
    login(userType);

    // Redireciona para a rota apropriada
    if (userType === 'patient') {
      router.push('/Login');
    } else if (userType === 'clinician') {
      router.push('/Login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-6">Selecione o Tipo de Usuário</h1>
      <div className="flex flex-col space-y-4">
        <button
          className="bg-green-800 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition duration-300"
          onClick={() => handleUserTypeSelection('patient')}
        >
          Paciente
        </button>
        <button
          className="bg-blue-800 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-300"
          onClick={() => handleUserTypeSelection('clinician')}
        >
          Clínico
        </button>
      </div>
    </div>
  );
};

export default TipoUsuario;
