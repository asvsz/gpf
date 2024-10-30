import React from 'react';

interface DayFilterProps {
    texto: string; // Texto a ser exibido no botão
    days: number; // Número de dias selecionados
    option: number; // Opção atual do botão
    onClick: (days: number) => void; // Função para atualizar o número de dias
    type?: "button" | "submit" | "reset"; // Tipo do botão
}

export default function DayFilter({ onClick, texto, days, option, type = "button" }: DayFilterProps) {
    return (
        <div className="flex items-center">
            <div className="flex space-x-2">
                <button
                    type={type}
                    onClick={() => onClick(option)} // Atualiza os dias ao clicar no botão
                    className={`border rounded-md px-4 py-2 text-sm ${
                        days === option
                            ? 'bg-green-800 text-white' // Cor do botão selecionado
                            : 'bg-gray-200 text-gray-800 hover:bg-blue-100' // Estilo padrão dos botões
                    }`}
                >
                    {texto}
                </button>
            </div>
        </div>
    );
}