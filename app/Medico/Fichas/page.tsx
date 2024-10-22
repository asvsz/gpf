'use client'
import ButtonIcon from "@/app/components/ButtonIcon";
import FooterBar from "@/app/components/Footer";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";
import React from "react";


export default function Fichas() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavbarDoctor />

        <ButtonIcon
            icon={<GoPlus className="text-3xl" />}
            texto="Fichas Avaliativas"
            onClick={() => {
                router.push(`/Medico/Fichas/CriarNeurofuncional`);
            }}
        />

      <FooterBar />
    </div>
  )
}