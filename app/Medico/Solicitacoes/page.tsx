import FooterBar from "@/app/components/Footer";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import PrivateRoute from "@/app/components/PrivateRoute";



export default function Solicitacoes() {
  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarDoctor />
        Aqui é as solicitações
        <FooterBar />
      </div>
    </PrivateRoute>
  )
}