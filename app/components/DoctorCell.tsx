import React from "react";
import ButtonOne from "./ButtonOne";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface DoctorProps {
  id: string;
  name?: string;
  surname?: string;
  gender?: string;
  occupation?: string;
  phoneNumber?: string;
  email?: string;
}

export default function DoctorCell({ id, name, surname, gender, occupation, email, phoneNumber }: DoctorProps) {

  return (
    <div className="flex gap-10 items-center">
      <div className="flex py-6 px-8 bg-gray-200 justify-between h-auto w-[1200px] rounded-2xl items-center shadow-lg">
        {/* Contêiner maior com largura personalizada */}
        <div className="flex flex-col">
          <div className="flex gap-1">
            <span className="text-xl font-bold text-gray-700">{name}</span>
            <span className="text-xl font-bold text-gray-700">{surname}</span>
          </div>
          <span className="font-light text-gray-400">{occupation}</span>

        </div>
        <div className="flex flex-col text-right ">
          <span className="text-lg font-semibold text-gray-500">{email}</span>
          <span className="font-light text-gray-400">{phoneNumber}</span>
        </div>
      </div>
    </div>
  );
}
