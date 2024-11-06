"use client";
import FooterBar from "@/app/components/Footer";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/context/AuthContext";
import ButtonOne from "@/app/components/ButtonOne";
import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { useRouter } from "next/navigation";

export default function Solicitacoes() {
  const router = useRouter();
  const [recordsShared, setRecordsShared] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleClickView = async (recordId: string, recordType: string) => {
    if (!recordId) {
      console.error("Erro: recordId está indefinido");
      alert("Erro interno: registro não encontrado.");
      return;
    }

    const recordRoutes: { [key: string]: string } = {
      Neuro: "/Medico/Fichas/FichaNeuro",
      Cardio: "/Medico/Fichas/FichaCardio",
      Trauma: "/Medico/Fichas/FichaTrauma",
    };

    const route = recordRoutes[recordType];

    if (!route) {
      console.log("Tipo de ficha não corresponde.");
      alert(
        "Este registro não corresponde a nenhum tipo de ficha que você pode visualizar."
      );
      return;
    }

    localStorage.setItem("currentRecordId", recordId);
    router.push(route);
  };

  useEffect(() => {
    async function fetchRecords() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get(
          `/manage-access/get-records-shared-with-me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecordsShared(response.data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecords();
  }, []);

  const recordTypeFullName: { [key: string]: string } = {
    Neuro: "Neurofuncional",
    Cardio: "Cardiorespiratório",
    Trauma: "Traumato-ortopédico",
  };

  return (
    <PrivateRoute requiredUserType="clinician">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarDoctor />
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col p-4 gap-8 justify-between">
            <ButtonOne texto="Requisitar acesso" onClick={() => router.push('/Medico/Solicitacoes/RequisitarAcesso')}/>
            <div className="flex justify-between">
              <h2 className="text-3xl font-bold pr-4">
                Solicitações de acesso e fichas compartilhadas
              </h2>
            </div>

            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <>
                {recordsShared && recordsShared.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    <h2 className="text-xl font-bold">Fichas avaliativas</h2>
                    {recordsShared.map((record: any) => (
                      <div
                        key={record.recordId}
                        className="border-b border-gray-300 pb-4 flex justify-between items-center"
                      >
                        <div>
                          <p>
                            <strong>Nome:</strong> {record.name}{" "}
                            {record.surname}
                          </p>
                          <p>
                            <strong>Tipo de Prontuário:</strong>{" "}
                            {recordTypeFullName[record.recordType] ||
                              "Desconhecido"}
                          </p>
                        </div>
                        <ButtonOne
                          texto="Visualizar"
                          onClick={() =>
                            handleClickView(record.recordId, record.recordType)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nenhum prontuário ainda foi compartilhado com você.</p>
                )}
              </>
            )}
          </div>
        </div>
        <FooterBar />
      </div>
    </PrivateRoute>
  );
}
