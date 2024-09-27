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
      className="container rounded h-14 hover:bg-green-700 text-white text-xl bg-green-800 w-64 py-2"
      onClick={onClick}
    >
      {texto}
    </button>
  )
}

