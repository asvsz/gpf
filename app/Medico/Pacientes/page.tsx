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
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("access_token")
      setLoading(true); // Inicia o carregamento
      try {
        const response = await api.get(`/patients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
        setPatients(mappedPatients);
      } catch (error) {
        console.error('Erro ao buscar pacientes', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchPatients();
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
      <div className="gap-4 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Navbar />
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col gap-8">
            <SearchEngine onSearch={handleSearch} />
            {loading ? ( // Exibe o carregando se true
              <div className="flex justify-center items-center h-32 text-lg text-gray-500">
                Carregando...
              </div>
            ) : (
              patientsToDisplay.length > 0 ? (
                patientsToDisplay.map((patient) => (
                  <PatientCell
                    key={patient.universalMedicalRecordId}
                    name={patient.name}
                    surname={patient.surname}
                    email={patient.email}
                    cpf={patient.cpf}
                    id={patient.universalMedicalRecordId}
                  />
                ))
              ) : (
                <div className="p-3 text-gray-500">Nenhum paciente encontrado</div>
              )
            )}
          </div>
        </div>

        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
