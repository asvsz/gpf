import React from 'react';
import Link from 'next/link';
import { ImProfile } from "react-icons/im";
import Image from 'next/image';
import Logo from '../assets/logo.svg';

const NavbarDoctor: React.FC = () => {

  console.log(Logo);
  return (
    <nav className="fixed top-0 left-0 bg-green-800 p-4 w-full z-10">
      <div className="container mx-auto flex justify-between items-center text-white ">
        <Image src={Logo} alt=''/>
        <div className=" flex text-white gap-4 text-lg font-bold ">
          <Link href="/">Pacientes</Link>
          <Link href="/Prontuarios-Medico">Prontuários</Link>
          <Link href="/Solicitacoes-Medico">Solicitações</Link>
          <Link href="/Sobre">Sobre</Link>
        </div>
        <div className='flex gap-4 justify-between items-center'>
          <p>Amanda Souza</p>
          <ImProfile />
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoctor;
