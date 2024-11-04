'use client'
import FooterBar from "../../components/Footer";
import SearchEngine from "../../components/SearchEngine";
import { useEffect, useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import api from "@/app/services/api";
import DoctorCell from "@/app/components/DoctorCell";
import NavbarPaciente from "@/app/components/NavbarPaciente";

interface ClinicianProps {
  id: string;
  name: string;
  surname: string;
  gender: string;
  occupation: string;
  phoneNumber: string;
  email: string;
}

export default function HomeClinician() {
  const [clinicians, setClinicians] = useState<ClinicianProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("access_token")
      setLoading(true); // Inicia o carregamento
      try {
        const response = await api.get(`/clinicians`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Médicos retornados:", response.data);
        const mappedPatients = response.data.clinicians.map((clinician: any) => ({
          id: clinician.id,
          name: clinician.name,
          surname: clinician.surname,
          gender: clinician.gender,
          occupation: clinician.occupation,
          phoneNumber: clinician.phoneNumber,
          email: clinician.email,
        }));
        setClinicians(mappedPatients);
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
  const filteredClinicians = clinicians.filter((clinician) =>
    clinician.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cliniciansToDisplay = searchTerm ? filteredClinicians : clinicians;

  return (
    <PrivateRoute requiredUserType="patient">
      <div className="gap-4 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarPaciente/>
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col gap-8">
            <SearchEngine onSearch={handleSearch} />
            {loading ? ( // Exibe o carregando se true
              <div className="flex justify-center items-center h-32 text-lg text-gray-500">
                Carregando...
              </div>
            ) : (
              cliniciansToDisplay.length > 0 ? (
                cliniciansToDisplay.map((clinician) => (
                  <DoctorCell
                    name={clinician.name}
                    surname={clinician.surname}
                    email={clinician.email}
                    phoneNumber={clinician.phoneNumber}
                    occupation={clinician.occupation}
                    id={clinician.id}
                  />
                ))
              ) : (
                <div className="p-3 text-gray-500">Nenhum fisioterapeuta encontrado</div>
              )
            )}
          </div>
        </div>

        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
