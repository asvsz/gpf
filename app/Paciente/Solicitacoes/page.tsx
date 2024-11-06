"use client";
import FooterBar from "@/app/components/Footer";
import NavbarPaciente from "@/app/components/NavbarPaciente";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useState, useEffect } from "react";
import api from "@/app/services/api";
import ButtonOne from "@/app/components/ButtonOne";
import { useRouter } from "next/navigation";

export default function Solicitacoes() {
  const router = useRouter();
  const [recordsShared, setRecordsShared] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAuthorization, setPendingAuthorization] = useState<any[]>([]);

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
    router.push(route); // Redireciona para a página do registro com base no tipo
  };

  // Função para autorizar o acesso
  const handleAuthorize = async (userId: string, recordType: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.patch(
        `/manage-access/pending-authorization/authorize-access/${userId}?recordType=${recordType}`,
        {},
        config
      );
      alert("Acesso autorizado com sucesso.");
      setPendingAuthorization(
        pendingAuthorization.filter((user) => user.userId !== userId)
      ); // Remove da lista
    } catch (error) {
      console.error("Erro ao autorizar acesso:", error);
      alert("Erro ao autorizar o acesso. Tente novamente.");
    }
  };

  // Função para negar o acesso
  const handleDeny = async (userId: string, recordType: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(
        `/manage-access/pending-authorization/deny-access/${userId}?recordType=${recordType}`,
        config
      );
      alert("Acesso negado com sucesso.");
      setPendingAuthorization(
        pendingAuthorization.filter((user) => user.userId !== userId)
      ); // Remove da lista
    } catch (error) {
      console.error("Erro ao negar acesso:", error);
      alert("Erro ao negar o acesso. Tente novamente.");
    }
  };

  // Busca os registros compartilhados e usuários pendentes
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token");

        // Buscar registros compartilhados com o usuário
        const recordsResponse = await api.get(
          `/manage-access/get-records-shared-with-me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecordsShared(recordsResponse.data);

        // Buscar usuários pendentes de autorização
        const pendingResponse = await api.get(
          `/manage-access/pending-authorization`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingAuthorization(pendingResponse.data.pendingAuthorizationUsers);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const recordTypeFullName: { [key: string]: string } = {
    Neuro: "Neurofuncional",
    Cardio: "Cardiorespiratório",
    Trauma: "Traumato-ortopédico",
  };

  return (
    <PrivateRoute requiredUserType="patient">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarPaciente />
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <div className="flex flex-col p-4 gap-8 justify-between">
            <ButtonOne
              texto="Requisitar acesso"
              onClick={() =>
                router.push("/Paciente/Solicitacoes/RequisitarAcesso")
              }
            />
            <div className="flex justify-between">
              <h2 className="text-3xl font-bold pr-4">
                Solicitações de acesso e fichas compartilhadas
              </h2>
            </div>

            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <>
                {pendingAuthorization && pendingAuthorization.length > 0 && (
                  <div className="flex flex-col gap-8 mt-8">
                    <h2 className="text-xl font-bold">
                      Usuários Pendentes de Autorização
                    </h2>
                    {pendingAuthorization.map((user: any) => (
                      <div
                        key={user.userId}
                        className="border-b border-gray-300 pb-4 flex justify-between items-center"
                      >
                        <div>
                          <p>
                            <strong>Nome:</strong> {user.name} {user.surname}
                          </p>
                          <p>
                            <strong>Tipo de Prontuário:</strong>{" "}
                            {user.recordType}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <ButtonOne
                            texto="Autorizar"
                            onClick={() =>
                              handleAuthorize(user.userId, user.recordType)
                            }
                          />
                          <ButtonOne
                            texto="Negar"
                            onClick={() =>
                              handleDeny(user.userId, user.recordType)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
