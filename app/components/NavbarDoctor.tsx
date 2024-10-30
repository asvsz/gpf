import React from 'react';
import Link from 'next/link';
import { ImProfile } from "react-icons/im";
import Image from 'next/image';
import Logo from '../assets/logo.svg';
import Perfil from '../Medico/Perfil/page';

const NavbarDoctor: React.FC = () => {

  console.log(Logo);
  return (
    <nav className="fixed top-0 left-0 bg-custom-green p-4 w-full z-10">
      <div className="container mx-auto flex justify-between items-center text-white ">
        <Image src={Logo} alt=''/>
        <div className=" flex text-white gap-4 text-lg font-bold ">
          <Link href="/Medico/Pacientes">Pacientes</Link>
          <Link href="/Medico/Fichas">Fichas</Link>
          <Link href="/Medico/Solicitacoes">Solicitações</Link>
          <Link href="/Medico/Sobre">Sobre</Link>
        </div>
        <div className='flex gap-4 justify-between items-center'>
          <Perfil id='"clinician_id_value'/>
          <ImProfile/>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoctor;
