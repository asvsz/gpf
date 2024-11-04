'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";
import ButtonOne from '@/app/components/ButtonOne';
import { useRouter } from 'next/navigation';

interface TraumaRecordProps {
    medicalDiagnosis: string;
    anamnesis: string;
    physicalExamination: string;
    triage: string;
    palpation: string;
    edema: boolean;
    pittingTest: boolean;
    fingerPressureTest: boolean;
    perimetry: {
        rightArm: number;
        leftArm: number;
        upperRightThigh: number;
        upperLeftThigh: number;
        lowerRightThigh: number;
        lowerLeftThigh: number;
        rightKnee: number;
        leftKnee: number;
    };
    subjectivePainAssessment: {
        intensity: number;
        location: string;
        characteristic: string;
    };
    specialOrthopedicTest: string;
}

export default function ViewTraumaRecord() {
    const [record, setRecord] = useState<TraumaRecordProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter()

    // Função para buscar os dados do registro neurofuncional
    const fetchRecordData = async () => {
        const recordId = localStorage.getItem('currentRecordId');
        if (!recordId) {
            console.error('No record ID found.');
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("Token não encontrado");
            }

            const response = await api.get(`/trauma-orthopedic-record/by-id/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data || !response.data.record) {
                throw new Error("Dados do registro não encontrados");
            }

            setRecord(response.data.record);
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            setError('Erro ao carregar os dados do registro.');
        } finally {
            setLoading(false);
        }
    };

    // Carregar os dados quando o componente for montado
    useEffect(() => {
        fetchRecordData();
    }, []);

    // Exibição do formulário para visualização do registro neurofuncional
    return (
        <PrivateRoute requiredUserType='clinician'>
            <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <NavbarDoctor />
                <h2 className="font-bold text-4xl text-gray-700 pt-8">Visualizar Trauma Ortopédico</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center text-lg text-gray-500 items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
                    <div className="grid gap-8 pb-8">
                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Diagnóstico Médico:</h3>
                            <p>{record.medicalDiagnosis}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Anamnese:</h3>
                            <p>{record.anamnesis}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Exame Físico:</h3>
                            <p>{record.physicalExamination}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Triagem:</h3>
                            <p>{record.triage}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Palpação:</h3>
                            <p>{record.palpation}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Edema:</h3>
                            <p>{record.edema ? 'Sim' : 'Não'}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste de Pitting:</h3>
                            <p>{record.pittingTest ? 'Positivo' : 'Negativo'}</p>
                        </div>

                        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste de Pressão Digital:</h3>
                            <p>{record.fingerPressureTest ? 'Positivo' : 'Negativo'}</p>
                        </div>

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Perimetria:</h3>
                            <p className='flex gap-2'><h3 className='font-semibold'>Braço Direito: </h3>{record.perimetry.rightArm}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Braço Esquerdo: </h3>{record.perimetry.leftArm}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Parte Superior Coxa Direita: </h3>{record.perimetry.upperRightThigh}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Parte Superior Coxa Esquerda: </h3>{record.perimetry.upperLeftThigh}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Parte Inferior Coxa Direita: </h3>{record.perimetry.lowerRightThigh}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Parte Inferior Coxa Esquerda: </h3>{record.perimetry.lowerLeftThigh}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Joelho Direito: </h3>{record.perimetry.rightKnee}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Joelho Esquerdo: </h3>{record.perimetry.leftKnee}</p>
                        </div>

                        <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Avaliação Subjetiva da Dor:</h3>
                            <p className='flex gap-2'><h3 className='font-semibold'>Intensidade: </h3>{record.subjectivePainAssessment.intensity}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Localização: </h3>{record.subjectivePainAssessment.location}</p>
                            <p className='flex gap-2'><h3 className='font-semibold'>Característica: </h3>{record.subjectivePainAssessment.characteristic}</p>
                        </div>

                            <div className="flex flex-col gap-4 bg-gray-100 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl block text-gray-700 font-medium pb-6">Teste Ortopédico Especial:</h3>
                            <p>{record.specialOrthopedicTest}</p>
                            </div>
                            <div className="flex w-full items-baseline justify-end gap-4 mt-4 pr-8">
                                <ButtonOne
                                    texto="Voltar"
                                    onClick={() => router.back()} />
                            </div>
                    </div>
                ) : (
                    <div>Registro não encontrado.</div>
                )}
                <Footer />
            </div>
        </PrivateRoute>
    );
}
