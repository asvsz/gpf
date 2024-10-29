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
import DayFilter from "@/app/components/DayFilter";

interface RecordProps {
    patientId: string;
    neurofunctionalRecordId: string;
    name: string;
    surname: string;
    createdAt: string; // Supondo que a data venha como string
    updatedAt: string; // Supondo que você queira exibir também
}
const options = [7, 14, 30, 60, 90, 180];

export default function Fichas() {
    const router = useRouter();
    const { clinicianId, loading } = useClinicians();
    const [records, setRecords] = useState<RecordProps[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [days, setDays] = useState(7);

    const handleFilter = () => {
        console.log(`Filtrando dados dos últimos ${days} dias`);
        // Aqui você pode adicionar a lógica para buscar os dados com base na quantidade de dias
    };

    // Função para buscar os registros do clínico
    const fetchRecords = async () => {
        if (!clinicianId) return;

        setLoadingRecords(true);
        const token = localStorage.getItem('access_token');

        try {
            // Buscando registros de três rotas diferentes
            const [response1, response2, response3] = await Promise.all([
                api.get(`/neurofunctional-record/fetch-ids-by-clinician-id/${clinicianId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                api.get(`/cardiorespiratory-record/fetch-ids-by-clinician-id/${clinicianId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                api.get(`/trauma-orthopedic-record/fetch-ids-by-clinician-id/${clinicianId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            // Combina os registros das diferentes rotas
            const allRecords = [
                ...response1.data.records,
                ...response2.data.records,
                ...response3.data.records,
            ];

            setRecords(allRecords); // Verifique se a estrutura é correta
            console.log("Records fetched:", allRecords);
        } catch (error) {
            console.error('Erro ao buscar os registros:', error);
        } finally {
            setLoadingRecords(false);
        }
    };

    // Função para buscar o tipo de ficha com base no patientId
    const fetchRecordTypeByPatientId = async (patientId: string) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await api.get(`/universal-medical-record/by-patient-id/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.universalMedicalRecord.specificMedicalRecordsIds; // Retorna apenas os IDs dos registros
        } catch (error) {
            console.error('Erro ao buscar tipos de registro:', error);
            return null; // Retorna null em caso de erro
        }
    };



    const handleClickEdit = async (neurofunctionalRecordId: string, patientId: string) => {
        console.log("ID do Registro:", neurofunctionalRecordId);
        console.log("ID do Paciente:", patientId);

        const recordTypes = await fetchRecordTypeByPatientId(patientId);

        if (recordTypes) {
            // Verificação para o tipo de ficha Neurofuncional
            if (recordTypes.neurofunctionalRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/EditarNeuro`);
            }
            // Verificação para o tipo de ficha Cardiorespiratória
            else if (recordTypes.cardiorespiratoryRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/EditarCardio`);
            }
            // Verificação para o tipo de ficha Traumatológica/Ortopédica
            else if (recordTypes.traumatoOrthopedicRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/EditarTrauma`);
            }
            else {
                console.log('Tipo de ficha não corresponde.');
                alert("Este registro não corresponde a nenhum tipo de ficha que você pode editar.");
            }
        } else {
            console.error('Não foi possível verificar o tipo de registro.');
        }
    };

    const handleClickView = async (neurofunctionalRecordId: string, patientId: string) => {
        console.log("ID do Registro:", neurofunctionalRecordId);
        console.log("ID do Paciente:", patientId);

        const recordTypes = await fetchRecordTypeByPatientId(patientId);

        if (recordTypes) {
            // Verificação para o tipo de ficha Neurofuncional
            if (recordTypes.neurofunctionalRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/FichaNeuro`);
            }
            // Verificação para o tipo de ficha Cardiorespiratória
            else if (recordTypes.cardiorespiratoryRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/FichaCardio`);
            }
            // Verificação para o tipo de ficha Traumatológica/Ortopédica
            else if (recordTypes.traumatoOrthopedicRecord === neurofunctionalRecordId) {
                localStorage.setItem('currentRecordId', neurofunctionalRecordId);
                router.push(`/Medico/Fichas/FichaTrauma`);
            }
            else {
                console.log('Tipo de ficha não corresponde.');
                alert("Este registro não corresponde a nenhum tipo de ficha que você pode visualizar.");
            }
        } else {
            console.error('Não foi possível verificar o tipo de registro.');
        }
    };


    // UseEffect para buscar registros quando clinicianId mudar
    useEffect(() => {
        fetchRecords();
    }, [clinicianId]);

    React.useEffect(() => {
        handleFilter();
    }, [days]);

    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <NavbarDoctor />
            <div className="flex justify-between">
                <div className="flex space-x-2">
                    {options.map(option => (
                        <DayFilter
                            key={option}
                            texto={`${option} dias`}
                            days={days}
                            option={option}
                            onClick={setDays}
                        />
                    ))}
                </div>

                <ButtonIcon
                    icon={<GoPlus className="text-3xl"/>}
                    texto="Neurofuncional"
                    onClick={() => {
                        router.push(`/Medico/Fichas/CriarNeurofuncional`);
                    }}
                />
            </div>
            <h1 className="text-3xl font-bold mb-4">Fichas Avaliativas</h1>

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
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[150px]">Nome</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[150px]">Sobrenome</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[180px]">Data de Criação
                            </th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[180px]">Data de
                                Atualização
                            </th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[100px]"></th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[100px]"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record, index) => (
                            <tr key={record.neurofunctionalRecordId}
                                className={`hover:bg-gray-100 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                <td className="py-4 px-8 text-center w-[150px]">{record.name}</td>
                                <td className="py-4 px-8 text-center w-[150px]">{record.surname}</td>
                                <td className="py-4 px-8 text-center w-[180px]">{new Date(record.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-8 text-center w-[180px]">{new Date(record.updatedAt).toLocaleDateString()}</td>
                                <td className="py-4 px-8 text-center w-[100px]">
                                    <ButtonOne
                                        texto="Editar"
                                        onClick={() => handleClickEdit(record.neurofunctionalRecordId, record.patientId)}
                                    />
                                </td>
                                <td className="py-4 px-8 text-center w-[100px]">
                                    <ButtonOne
                                        texto="Visualizar"
                                        onClick={() => handleClickView(record.neurofunctionalRecordId, record.patientId)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            )}
            <FooterBar/>
        </div>
    );
}
