'use client'
import { useRouter } from "next/navigation";
import FooterBar from "../components/Footer";
import NavbarDoctor from "../components/NavbarDoctor";
import ButtonIcon from "../components/Button-icon";
import { GoPlus } from "react-icons/go";


export default function Prontuarios() {

  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavbarDoctor />

      <ButtonIcon icon={<GoPlus className="text-3xl" />} texto="Criar Prontuário" onClick={() => router.push('/Sobre')}/>
        
      <FooterBar />
    </div>
  )
}