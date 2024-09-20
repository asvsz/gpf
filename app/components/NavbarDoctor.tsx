import React from 'react';
import Link from 'next/link';
import { ImPlus } from "react-icons/im";
import { ImProfile } from "react-icons/im";

const NavbarDoctor: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 bg-green-800 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center text-white ">
        <ImPlus />
        <div className=" flex text-white gap-4 text-lg font-bold ">
          <Link href="/">Pacientes</Link>
          <Link href="/Prontuarios-Medico">Prontuarios</Link>
          <Link href="/Solicitacoes-Medico">Solicitações</Link>
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
