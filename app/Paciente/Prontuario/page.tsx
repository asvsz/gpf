'use client'
import ButtonIcon from "@/app/components/ButtonIcon";
import FooterBar from "@/app/components/Footer";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";


export default function Prontuario() {

  const router = useRouter();

  return (
    <PrivateRoute requiredUserType="patient">
      <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarDoctor />

        <ButtonIcon icon={<GoPlus className="text-3xl" />} texto="Fichas Avaliativas" onClick={() => router.push('/Sobre')} />

        <FooterBar />
      </div>
    </PrivateRoute>
  )
}