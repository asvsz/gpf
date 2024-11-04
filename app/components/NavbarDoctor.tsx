'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importando usePathname
import { ImProfile } from "react-icons/im";
import Image from 'next/image';
import Logo from '../assets/logo.svg';
import PerfilDoctor from '../Medico/Perfil/page';

const NavbarDoctor: React.FC = () => {
  const pathname = usePathname(); // Obtém o pathname atual

  return (
    <nav className="fixed top-0 left-0 bg-custom-green p-4 w-full z-10">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Image src={Logo} alt='' />
        <div className="flex gap-4 text-lg font-medium">
          {/** Links com verificação de rota ativa */}
          <Link href="/Medico/Pacientes" className={`relative py-2 px-4 rounded ${pathname === '/Medico/Pacientes' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Medico/Pacientes' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Pacientes
          </Link>
          <Link href="/Medico/Fichas" className={`relative py-2 px-4 rounded ${pathname === '/Medico/Fichas' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Medico/Fichas' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Fichas
          </Link>
          <Link href="/Medico/Solicitacoes" className={`relative py-2 px-4 rounded ${pathname === '/Medico/Solicitacoes' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Medico/Solicitacoes' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Solicitações
          </Link>
          <Link href="/Medico/Sobre" className={`relative py-2 px-4 rounded ${pathname === '/Medico/Sobre' ? 'bg-white text-custom-green' : 'text-white'}`}>
            {pathname === '/Medico/Sobre' && (
              <span className="absolute inset-0 rounded-lg border-2 border-custom-green" />
            )}
            Sobre
          </Link>
        </div>
        <div className='flex gap-4 justify-between items-center'>
          <PerfilDoctor id='"clinician_id_value' />
          <ImProfile />
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoctor;
