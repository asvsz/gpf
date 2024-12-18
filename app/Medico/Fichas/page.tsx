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
    neurofunctionalRecordId: string; // Coloque o '?' se o ID pode ser undefined
    cardiorespiratoryRecordId: string; // Adicionando o ID de Cardiorespiratório
    traumaOrthopedicRecordId: string; // Adicionando o ID de Traumatológico/Ortopédico
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

            // Retorna todos os registros específicos como um objeto
            return response.data.universalMedicalRecord.specificMedicalRecordsIds; // Confirme a estrutura aqui
        } catch (error) {
            console.error('Erro ao buscar tipos de registro:', error);
            return null; // Retorna null em caso de erro
        }
    };

    const handleClickEdit = async (recordId: string | undefined, patientId: string) => {
        if (!recordId) {
            console.error("Erro: recordId está indefinido");
            alert("Erro interno: registro não encontrado.");
            return;
        }
        console.log("ID do Registro:", recordId);
        console.log("ID do Paciente:", patientId);

        const recordTypes = await fetchRecordTypeByPatientId(patientId);

        if (recordTypes) {
            console.log("Tipos de Registro:", recordTypes);

            if (recordTypes.neurofunctionalRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/EditarNeuro`);

            } else if (recordTypes.cardiorespiratoryRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/EditarCardio`);

            } else if (recordTypes.traumatoOrthopedicRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/EditarTrauma`);
            } else {
                console.log('Tipo de ficha não corresponde.');
                alert("Este registro não corresponde a nenhum tipo de ficha que você pode editar.");
            }
        } else {
            console.error('Não foi possível verificar o tipo de registro.');
        }
    };




    const handleClickView = async (recordId: string | undefined, patientId: string) => {
        if (!recordId) {
            console.error("Erro: recordId está indefinido");
            alert("Erro interno: registro não encontrado.");
            return;
        }
        console.log("ID do Registro:", recordId);
        console.log("ID do Paciente:", patientId);

        const recordTypes = await fetchRecordTypeByPatientId(patientId);
        console.log("Tipos de Registro:", recordTypes);

        if (recordTypes) {
            if (recordTypes.neurofunctionalRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/FichaNeuro`);
            } else if (recordTypes.cardiorespiratoryRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/FichaCardio`);
            } else if (recordTypes.traumatoOrthopedicRecord === recordId) {
                localStorage.setItem('currentRecordId', recordId);
                router.push(`/Medico/Fichas/FichaTrauma`);
            } else {
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
        <div className="flex flex-col min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <NavbarDoctor />
            <div className="flex justify-between pt-4">
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

               <div className='flex justify-between gap-4'>
                   <ButtonIcon
                       icon={<GoPlus className="text-3xl"/>}
                       texto="Neurofuncional"
                       onClick={() => {
                           router.push(`/Medico/Fichas/CriarNeurofuncional`);
                       }}
                   />
                   <ButtonIcon
                       icon={<GoPlus className="text-3xl"/>}
                       texto="Cardiorespiratório"
                       onClick={() => {
                           router.push(`/Medico/Fichas/CriarCardio`);
                       }}
                   /><ButtonIcon
                   icon={<GoPlus className="text-3xl"/>}
                        texto="Trauma Ortopédico"
                   onClick={() => {
                       router.push(`/Medico/Fichas/CriarTrauma`);
                   }}
               />
               </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-700">Fichas Avaliativas</h1>

            {/* Loader e mensagem quando não há dados */}
            {(loading || loadingRecords) && (
                <div className="flex justify-center text-lg text-gray-500 items-center h-64">
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
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden  ">

                        <thead>
                        <tr className="bg-gray-200 text-gray-600 font-medium">
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[150px]">Nome</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[150px]">Sobrenome</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[180px]">Data de Criação</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[180px]">Data de Atualização</th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[150px]">Tipo de Ficha</th> {/* Nova coluna */}
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[100px]"></th>
                            <th className="py-2 px-7 border-b border-gray-200 text-center w-[100px]"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record, index) => (
                            <tr key={record.patientId} className={`text-gray-500 font-normal hover:bg-gray-100 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                <td className="py-4 px-8 text-center w-[150px]">{record.name}</td>
                                <td className="py-4 px-8 text-center w-[150px]">{record.surname}</td>
                                <td className="py-4 px-8 text-center w-[180px]">{new Date(record.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-8 text-center w-[180px]">{new Date(record.updatedAt).toLocaleDateString()}</td>

                                {/* Defina o tipo de ficha com base nos IDs */}
                                <td className="py-4 px-8 text-center w-[150px]">
                                    {record.neurofunctionalRecordId ? 'Neurofuncional' :
                                        record.cardiorespiratoryRecordId ? 'Cardiorespiratório' :
                                            record.traumaOrthopedicRecordId ? 'Trauma Ortopédico' : 'Desconhecido'}
                                </td>

                                <td className="py-4 px-8 text-center w-[100px]">
                                    <ButtonOne
                                        texto="Editar"
                                        onClick={() => {
                                            handleClickEdit(record.neurofunctionalRecordId || record.cardiorespiratoryRecordId || record.traumaOrthopedicRecordId, record.patientId);
                                        }}
                                    />
                                </td>
                                <td className="py-4 px-8 text-center w-[100px]">
                                    <ButtonOne
                                        texto="Visualizar"
                                        onClick={() => {
                                            handleClickView(record.neurofunctionalRecordId || record.cardiorespiratoryRecordId || record.traumaOrthopedicRecordId, record.patientId);
                                        }}
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
