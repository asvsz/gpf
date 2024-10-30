'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/services/api";
import PrivateRoute from '@/app/components/PrivateRoute';
import NavbarDoctor from "@/app/components/NavbarDoctor";
import Footer from "@/app/components/Footer";

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

export default function ViewNeurofunctionalRecord() {
    const [record, setRecord] = useState<TraumaRecordProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <h2 className=" text-3xl font-bold">Visualizar Registro Neurofuncional</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span>Carregando...</span>
                    </div>
                ) : record ? (
                    <div className="flex flex-col mb-10">
                        <div>
                            <h3 className="font-semibold">Diagnóstico Médico:</h3>
                            <p>{record.medicalDiagnosis}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Anamnese:</h3>
                            <p>{record.anamnesis}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Exame Físico:</h3>
                            <p>{record.physicalExamination}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Triagem:</h3>
                            <p>{record.triage}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Palpação:</h3>
                            <p>{record.palpation}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Edema:</h3>
                            <p>{record.edema ? 'Sim' : 'Não'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Teste de Pitting:</h3>
                            <p>{record.pittingTest ? 'Positivo' : 'Negativo'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Teste de Pressão Digital:</h3>
                            <p>{record.fingerPressureTest ? 'Positivo' : 'Negativo'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Perimetria:</h3>
                            <p>Braço Direito: {record.perimetry.rightArm}</p>
                            <p>Braço Esquerdo: {record.perimetry.leftArm}</p>
                            <p>Parte Superior Coxa Direita: {record.perimetry.upperRightThigh}</p>
                            <p>Parte Superior Coxa Esquerda: {record.perimetry.upperLeftThigh}</p>
                            <p>Parte Inferior Coxa Direita: {record.perimetry.lowerRightThigh}</p>
                            <p>Parte Inferior Coxa Esquerda: {record.perimetry.lowerLeftThigh}</p>
                            <p>Joelho Direito: {record.perimetry.rightKnee}</p>
                            <p>Joelho Esquerdo: {record.perimetry.leftKnee}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Avaliação Subjetiva da Dor:</h3>
                            <p>Intensidade: {record.subjectivePainAssessment.intensity}</p>
                            <p>Localização: {record.subjectivePainAssessment.location}</p>
                            <p>Característica: {record.subjectivePainAssessment.characteristic}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Teste Ortopédico Especial:</h3>
                            <p>{record.specialOrthopedicTest}</p>
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
