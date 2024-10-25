'use client';
import ButtonIcon from "@/app/components/ButtonIcon";
import FooterBar from "@/app/components/Footer";
import NavbarDoctor from "@/app/components/NavbarDoctor";
import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { useClinicians } from '@/app/hooks/useFetchClinico';
import api from '@/app/services/api';
import ButtonOne from "@/app/components/ButtonOne";

interface RecordProps {
    patientId: string;
    neurofunctionalRecordId: string;
    name: string;
    surname: string;
    createdAt: string; // Supondo que a data venha como string
    updatedAt: string; // Supondo que você queira exibir também
}

export default function Fichas() {
    const router = useRouter();
    const { clinicianId, loading } = useClinicians();
    const [records, setRecords] = useState<RecordProps[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(true);

    // Função para buscar os registros do clínico
    const fetchRecords = async () => {
        if (!clinicianId) return;

        setLoadingRecords(true);
        const token = localStorage.getItem('access_token');
        try {
            const response = await api.get(`/neurofunctional-record/fetch-ids-by-clinician-id/${clinicianId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecords(response.data.records); // Verifique se a estrutura é correta
            console.log("Records fetched:", response.data.records);
        } catch (error) {
            console.error('Erro ao buscar os registros:', error);
        } finally {
            setLoadingRecords(false);
        }
    };

    // UseEffect para buscar registros quando clinicianId mudar
    useEffect(() => {
        fetchRecords();
    }, [clinicianId]);

    const handleClickEdit = (neurofunctionalRecordId: string) => {
        localStorage.setItem('currentRecordId', neurofunctionalRecordId);
        router.push(`/Medico/Fichas/Editar`);
    };

    const handleClickView = (neurofunctionalRecordId: string) => {
        localStorage.setItem('currentRecordId', neurofunctionalRecordId);
        router.push(`/Medico/Fichas/Ficha`);
    };


    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <NavbarDoctor />

            <ButtonIcon
                icon={<GoPlus className="text-3xl" />}
                texto="Fichas Avaliativas"
                onClick={() => {
                    router.push(`/Medico/Fichas/CriarNeurofuncional`);
                }}
            />
            <h1 className="text-2xl font-bold mb-4">Registros Neurofuncionais</h1>

            {/* Loader e mensagem quando não há dados */}
            {(loading || loadingRecords) && (
                <div className="flex justify-center items-center h-64">
                    <span>Carregando...</span>
                </div>
            )}

            {!loading && !loadingRecords && !records.length && (
                <div className="flex justify-center items-center h-64">
                    <span>Nenhum registro encontrado.</span>
                </div>
            )}

            {!loading && !loadingRecords && records.length > 0 && (
                <div className="flex-grow">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b">Nome</th>
                            <th className="py-2 px-4 border-b">Sobrenome</th>
                            <th className="py-2 px-4 border-b">Data de Criação</th>
                            <th className="py-2 px-4 border-b">Data de Atualização</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record) => (
                            <tr key={record.neurofunctionalRecordId} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{record.name}</td>
                                <td className="py-2 px-4 border-b">{record.surname}</td>
                                <td className="py-2 px-4 border-b">{new Date(record.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{new Date(record.updatedAt).toLocaleDateString()}</td>
                                <ButtonOne
                                    texto="Editar"
                                    onClick={() => handleClickEdit(record.neurofunctionalRecordId)}
                                />
                                <ButtonOne
                                    texto="Visualizar"
                                    onClick={() => handleClickView(record.neurofunctionalRecordId)}
                                />
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <FooterBar />
        </div>
    );
}
