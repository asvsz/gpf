import React from 'react';

interface SaveButtonProps {
  onClick: () => void;  // Função para executar ao clicar no botão
  label?: string;       // Texto opcional para o botão, por padrão será "Salvar"
}

export default function SaveButton ({ onClick, label = "Salvar" }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
    >
      {label}
    </button>
  );
};

