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
      <div className="min-h-screen p-8 pb-20 sm:p-20 flex flex-col bg-gray-100 mx-auto">
        <Header/>

        {/* Container para logo e conteúdo */}
        <div className="flex flex-grow items-center justify-center"> {/* Use justify-center para centralizar ambos */}
          {/* Logo à esquerda */}
          <div className="flex-shrink-0 w-1/2"> {/* Ajuste a largura conforme necessário */}
            <Image src={Logo} alt="logo" width={700} height={100}/>
          </div>

          {/* Conteúdo à direita */}
          <div className="flex flex-col items-center justify-center w-2/2"> {/* Ajuste a largura conforme necessário */}
            <h1 className="font-bold text-4xl text-custom-green pb-6 mb-6">Selecione o Tipo de Usuário</h1>
            <div className="flex flex-col items-center space-y-6">
              <button
                  className="font-medium bg-gray-300 text-xl text-custom-green rounded-lg px-8 py-2 hover:bg-custom-green hover:text-white transition duration-300"
                  onClick={() => handleUserTypeSelection('patient')}
              >
                Paciente
              </button>
              <button
                  className="font-medium bg-gray-300 text-xl text-green-800 rounded-lg px-8 py-2 hover:bg-custom-green hover:text-white transition duration-300"
                  onClick={() => handleUserTypeSelection('clinician')}
              >
                Fisioterapeuta
              </button>
            </div>
          </div>
        </div>

        <FooterBar/>
      </div>


  );
};

export default TipoUsuario;
