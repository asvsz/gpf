import Image from "next/image";
import FooterBar from "./components/Footer";
import HeaderBar from "./components/Header";
import Navbar from "./components/NavbarDoctor";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Olá</p>
      </main>
      <FooterBar />
    </div>
  );
}
