'use client'
import FooterBar from "../../components/Footer";
import Navbar from "../../components/NavbarDoctor";
import PatientCell from "../../components/PatientCell";
import SearchEngine from "../../components/SearchEngine";
import { useEffect, useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import api from "@/app/services/api";

interface Patient {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  universalMedicalRecordId: string;
  birthDate: string;
  gender: string;
  cpf: string;
}

export default function Home() {

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {

    const fetchPatients = async () => {
      const token = localStorage.getItem("access_token")
      try {
        
        const response = await api.get(`/patients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log("Pacientes retornados:", response.data);
        const mappedPatients = response.data.patients.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          surname: patient.surname,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          universalMedicalRecordId: patient.universalMedicalRecordId,
          birthDate: patient.birthDate,
          gender: patient.gender,
          cpf: patient.cpf,
        }));
        console.log(response.data)
        setPatients(mappedPatients)

      } catch (error) {
        console.error('Erro ao buscar pacientes', error)
      }
    }
    fetchPatients()
  }, []);

  // Função para atualizar o termo de busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filtrar pacientes com base no termo de busca
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientsToDisplay = searchTerm ? filteredPatients : patients;

  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="gap-8 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Navbar />
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col gap-8 pt-10">
            {/* Passar a função de busca para o componente de busca */}
            <SearchEngine onSearch={handleSearch} />
            {/* Exibir apenas o paciente filtrado */}
            {patientsToDisplay.length > 0 ? (
              patientsToDisplay.map((patient) => (
                <PatientCell
                  key={patient.universalMedicalRecordId}
                  name={patient.name}
                  email={patient.email}
                  cpf={patient.cpf}
                  id={patient.universalMedicalRecordId}
                />
              ))
            ) : (
              <div className="p-3 text-gray-500">Nenhum paciente encontrado</div>
            )}
          </div>

        </div>

        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
