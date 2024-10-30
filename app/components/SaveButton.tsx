import React from 'react';

interface SaveButtonProps {
  onClick: () => void;  // Função para executar ao clicar no botão
  label?: string;       // Texto opcional para o botão, por padrão será "Salvar"
}

export default function SaveButton ({ onClick, label = "Salvar" }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-custom-green text-white px-4 py-2 rounded-md hover:bg-custom-ligh-green transition"
    >
      {label}
    </button>
  );
};

