'use client'
import FooterBar from "./components/Footer";
import Navbar from "./components/NavbarDoctor";
import PatientCell from "./components/Patient-cell";
import SearchEngine from "./components/Search-engine";
import patientData from "./data/patient.json";
import { useEffect, useState } from "react";

interface Patient {
  nome: string;
  cpf: string;
  numeroProntuario: string;
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setPatients(patientData);
  }, []);

  // Função para atualizar o termo de busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filtrar pacientes com base no termo de busca
  const filteredPatients = patients.filter((patient) =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  return (
    <div className="gap-8 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className=" flex row-start-2 items-center sm:items-start z-0">
        <div className="flex flex-col gap-8 pt-10">
          {/* Passar a função de busca para o componente de busca */}
          <SearchEngine onSearch={handleSearch} />
          {/* Exibir apenas o paciente filtrado */}
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCell
                key={patient.cpf}
                nome={patient.nome}
                cpf={patient.cpf}
                numeroProntuario={patient.numeroProntuario}
              />
            ))
          ) : (
            <div className="p-3 text-gray-500">Nenhum paciente encontrado</div>
          )}
        </div>
      </main>
      <FooterBar />
    </div>
  );
}
