import React from "react"

type ButtonProps = {
  texto: string;
  icon?: React.ReactNode; 
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ButtonIcon({icon, texto, onClick }: ButtonProps) {
  return (
    <button className="container flex rounded h-14 hover:bg-green-700 text-white text-xl bg-green-800 w-64 p-2 
    justify-center items-center" onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {texto}
    </button>
  )
}

