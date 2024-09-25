import React from "react"

type ButtonProps = {
  texto: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function ButtonOne ({ texto, onClick }: ButtonProps){
  return (
    <button className="container rounded h-14 hover:bg-green-700 text-white text-xl bg-green-800 w-64 py-2" onClick={onClick}>
        {texto}
      </button>
  )
}

