import React from 'react';

interface CancelButtonProps {
  onClick: () => void;  // Função para executar ao clicar no botão
  label?: string;       // Texto opcional para o botão, por padrão será "Cancelar"
}

export default function CancelButton({ onClick, label = "Cancelar" }: CancelButtonProps){
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
    >
      {label}
    </button>
  );
};

