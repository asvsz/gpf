'use client'
import FooterBar from "./components/Footer";
import Navbar from "./components/NavbarDoctor";
import PatientCell from "./components/Patient-cell";
import patientData from "./data/patient.json";
import { useEffect, useState } from "react";

interface Patient {
  nome: string;
  cpf: string;
  numeroProntuario: string;
}


export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    setPatients(patientData);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-8">
          {patients.map((patient) => (
            <PatientCell
              nome={patient.nome}
              cpf={patient.cpf}
              numeroProntuario={patient.numeroProntuario}
            />
          ))}
       </div>
      </main>
      <FooterBar />
    </div>
  );
}
