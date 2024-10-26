'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Header from "@/app/components/Header";
import FooterBar from "@/app/components/Footer";
import Logo from './Logotipo GPF.svg';
import Image from "next/image";

const TipoUsuario: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleUserTypeSelection = (userType: 'patient' | 'clinician') => {
    login(userType);
    router.push('/Login');
  };

  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        {/* Container para logo e botões */}
        <div className="flex flex-grow items-center justify-center space-x-4">
          {/* Logo */}
          <div className="flex-shrink-0 bg-white">
            <Image src={Logo} alt="logo" width={700} height={100}/>
          </div>

          {/* Linha separadora */}
          <div className="flex h-full border-l border-gray-300 mx-4"></div>

          <div className="flex flex-col items-center">
            <h1 className="text-3xl mb-6">Selecione o Tipo de Usuário</h1>
            <div className="flex flex-col items-center space-y-4">
              <button
                  className="bg-gray-300 text-xl text-green-800 rounded-lg px-4 py-2 hover:bg-green-700 hover:text-white transition duration-300"
                  onClick={() => handleUserTypeSelection('patient')}
              >
                Paciente
              </button>
              <button
                  className="bg-gray-300 text-xl text-green-800 rounded-lg px-4 py-2 hover:bg-green-700 hover:text-white transition duration-300"
                  onClick={() => handleUserTypeSelection('clinician')}
              >
                Clínico
              </button>
            </div>
          </div>
        </div>

        <FooterBar />
      </div>
  );
};

export default TipoUsuario;
