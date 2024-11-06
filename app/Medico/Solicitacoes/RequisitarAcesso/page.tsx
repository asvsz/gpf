"use client";
import React, { useState, useEffect } from "react";
import { useFetchPaciente } from "@/app/hooks/useFetchPaciente";
import { useFetchRegistroMedicoUniversal } from "@/app/hooks/useFetchRegistroMedicoUniversal";
import { useClinicians } from "@/app/hooks/useFetchClinico"; // Importe o novo hook
import api from "@/app/services/api";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import ButtonOne from "@/app/components/ButtonOne";
import PrivateRoute from "@/app/components/PrivateRoute";
import FooterBar from "@/app/components/Footer";

// interface Paciente {
//   id: string;
//   name: string;
//   surname: string;
//   cpf: string;
// }

export default function RequisitarAcesso() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [recordType, setRecordType] = useState("");

  const handleSubmit = async () => {
    try {
      if (!recordType) {
        alert("Por favor, selecione o tipo de ficha avaliativa.");
        return;
      }

      const token = localStorage.getItem("access_token");
      
      if (!token) {
        alert("Token de autenticação não encontrado. Faça login novamente.");
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Tenta buscar o paciente pelo CPF
      const patientResponse = await api.get(`/patients/by-cpf/${cpf}`, config);
      if (!patientResponse.data || !patientResponse.data.patient) {
        alert("Paciente não encontrado.");
        return;
      }
  
      const patientId = patientResponse.data.patient.id;
  
      // Tenta solicitar o acesso com base no ID do paciente e no tipo de ficha
      const accessResponse = await api.patch(
        `/manage-access/request-access-by-patient-id/${patientId}?recordType=${recordType}`,
        {},  // Corpo da requisição PATCH (aqui está vazio)
        config
      );
  
      if (accessResponse.status === 200) {
        alert("Solicitação de acesso realizada com sucesso.");
        router.push("/Medico/Solicitacoes");
      } else {
        alert("Erro ao solicitar acesso. Tente novamente.");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Acesso não autorizado. Verifique seu login e tente novamente.");
        } else if (error.response.status === 404) {
          if (error.response.config.url.includes("/patients/by-cpf")) {
            alert("Paciente não encontrado. Verifique o CPF e tente novamente.");
          } else if (error.response.config.url.includes("/manage-access/request-access-by-patient-id")) {
            alert("Registro médico não encontrado para o tipo de ficha selecionado.");
          }
        } else if (error.response.status === 409) {
          alert("Solicitação de acesso já foi realizada anteriormente.");
        } else {
          alert("Erro ao processar a solicitação. Tente novamente.");
        }
      } else {
        console.error("Erro ao processar a solicitação:", error);
        alert("Ocorreu um erro ao buscar o paciente ou solicitar acesso.");
      }
    }
  };

  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarDoctor />
        <h2 className="text-4xl font-bold text-gray-700 mb-4 mt-36">Requisitar Acesso</h2>
        <div>
          <label className="block mb-2">
            CPF do Paciente:
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Digite o CPF do paciente"
              className="border rounded w-full py-2 px-3 mt-1"
            />
            Tipo de ficha avaliativa:
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="Cardio">Cardiorespiratorio</option>
              <option value="Neurofunctional">Neurofuncional</option>
              <option value="Trauma">Traumato-ortopédico</option>
            </select>
          </label>
          <ButtonOne texto={"Solicitar"} onClick={handleSubmit} />
        </div>
        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
