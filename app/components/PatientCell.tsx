import React from "react";
import ButtonOne from "./ButtonOne";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface PatientProps {
  name: string;
  surname: string;
  email: string;
  cpf: string;
  id: string;
}

export default function PatientCell({ name, surname, email, cpf, id }: PatientProps) {
  const { setProntuarioId } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    setProntuarioId(id); // Armazena o ID do prontuário
    router.push(`/Medico/Pacientes/Prontuario`); // Redireciona para a página de prontuário
  };

  return (
    <div className="flex gap-10 items-center">
      <div className="flex py-6 px-8 bg-gray-200 justify-between h-auto w-[1200px] rounded-2xl items-center shadow-lg">
        {/* Contêiner maior com largura personalizada */}
        <div className="flex flex-col">
          <div className="flex gap-1">
            <span className="text-xl font-bold text-gray-700">{name}</span>
            <span className="text-xl font-bold text-gray-700">{surname}</span>
          </div>
          <span className="font-light text-gray-400">{cpf}</span>
        </div>
        <div>
          <span className="text-lg font-semibold text-gray-500">{email}</span>
        </div>
      </div>

      <ButtonOne
        texto="Visualizar Prontuário"
        onClick={handleClick} // Adiciona o ID à URL
      />
    </div>
  );
}
