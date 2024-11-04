'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importando usePathname
import { ImProfile } from "react-icons/im";
import Image from 'next/image';
import Logo from '../assets/logo.svg';
import PerfilPaciente from '../Paciente/Perfil/page';

const NavbarPaciente: React.FC = () => {
  const pathname = usePathname(); // Obtém o pathname atual

  return (
    <nav className="fixed top-0 left-0 bg-custom-green p-4 w-full z-10">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Image src={Logo} alt='' />
        <div className="flex gap-4 text-lg font-medium">
          {/** Links com verificação de rota ativa */}
          <Link href="/Paciente/Prontuario" className={`relative py-2 px-4 rounded ${pathname === '/Paciente/Prontuario' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Paciente/Prontuario' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Prontuario
          </Link>
          <Link href="/Paciente/Medicos" className={`relative py-2 px-4 rounded ${pathname === '/Paciente/Medicos' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Paciente/Medicos' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Medicos
          </Link>
          <Link href="/Paciente/Solicitacoes" className={`relative py-2 px-4 rounded ${pathname === '/Paciente/Solicitacoes' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Paciente/Solicitacoes' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Solicitações
          </Link>
          <Link href="/Paciente/Sobre" className={`relative py-2 px-4 rounded ${pathname === '/Paciente/Sobre' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Paciente/Sobre' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Sobre
          </Link>
        </div>
        <div className='flex gap-4 justify-between items-center'>
          <PerfilPaciente id='patient_id_value' />
          <ImProfile />
        </div>
      </div>
    </nav>
  );
};

export default NavbarPaciente;
