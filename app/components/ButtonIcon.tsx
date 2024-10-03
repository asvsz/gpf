import React from "react"

type ButtonProps = {
  texto: string;
  icon?: React.ReactNode; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export default function ButtonIcon({icon, texto, onClick, type="button" }: ButtonProps) {
  return (
    <button
      type={type}
      className="container flex rounded h-14 hover:bg-green-700 text-white text-xl bg-green-800 w-64 p-2 
    justify-center items-center"
      onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {texto}
    </button>
  )
}
