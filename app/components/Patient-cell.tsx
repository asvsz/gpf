import React from "react"
import ButtonOne from "./Button-one";
import { useRouter } from "next/navigation";

interface PatientProps {
  nome: string;
  cpf: string;
  numeroProntuario: string;
}

export default function PatientCell({ nome, cpf, numeroProntuario }: PatientProps) {
  
  const router = useRouter();
  
  return (
    <div className="flex gap-10 items-center">
      <div className="flex py-6 px-8 bg-gray-200 justify-between h-auto w-[800px] rounded-2xl items-center shadow-lg">
        {/* Contêiner maior com largura personalizada */}
        <div className="flex flex-col">
          <span className="text-xl font-bold text-black">{nome}</span>  {/* Nome, fonte maior e em negrito */}
          <span className="text-lg mt-2 text-gray-400">{cpf}</span>   {/* CPF abaixo do nome com espaçamento */}
        </div>
        <div>
          <span className="text-lg font-bold text-gray-600">{numeroProntuario}</span>  {/* Número do Prontuário */}
        </div>
      </div>

      <ButtonOne texto="Visualizar Prontuário" onClick={() => router.push('/Sobre')} />
    </div>

  )
}

