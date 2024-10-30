import React from "react"

type ButtonProps = {
  texto: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export default function ButtonOne({ texto, onClick, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className="inline-flex items-center rounded hover:bg-custom-ligh-green text-white text-lg bg-custom-green py-2 px-4"
      onClick={onClick}
    >
      {texto}
    </button>
  )
}

