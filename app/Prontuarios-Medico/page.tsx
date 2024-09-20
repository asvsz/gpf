import FooterBar from "../components/Footer";
import NavbarDoctor from "../components/NavbarDoctor";


export default function Prontuarios() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavbarDoctor />
      Aqui é os prontuários
      <FooterBar />
    </div>
  )
}