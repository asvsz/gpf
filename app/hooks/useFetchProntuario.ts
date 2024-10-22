import { useState, useEffect } from 'react';
import api from "../services/api";

interface Prontuario {
    id: string;
    patientId: string;
    consultationsIds: string[];
    profession: string;
    emergencyContactEmail: string;
    emergencyContactNumber: string;
    cpf: string;
    allergies: string;
    maritalStatus: string;
    height: number;
    weight: number;
    medicationsInUse: string[];
    diagnosis: string[];
    createdAt: string;
    updatedAt: string;
}

export const useFetchProntuario = (prontuarioId: string | null) => {
    const [prontuario, setProntuario] = useState<Prontuario | null>(null);

    useEffect(() => {
        const fetchProntuario = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get(`/universal-medical-record/${prontuarioId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.data.universalMedicalRecord) {
                    throw new Error("Prontuário não encontrado");
                }

                const mappedProntuario: Prontuario = {
                    id: response.data.universalMedicalRecord.id,
                    patientId: response.data.universalMedicalRecord.patientId,
                    consultationsIds: response.data.universalMedicalRecord.consultationsIds,
                    profession: response.data.universalMedicalRecord.profession,
                    emergencyContactEmail: response.data.universalMedicalRecord.emergencyContactEmail,
                    emergencyContactNumber: response.data.universalMedicalRecord.emergencyContactNumber,
                    cpf: response.data.universalMedicalRecord.cpf,
                    allergies: response.data.universalMedicalRecord.allergies,
                    maritalStatus: response.data.universalMedicalRecord.maritalStatus,
                    height: response.data.universalMedicalRecord.height,
                    weight: response.data.universalMedicalRecord.weight,
                    medicationsInUse: response.data.universalMedicalRecord.medicationsInUse,
                    diagnosis: response.data.universalMedicalRecord.diagnosis,
                    createdAt: response.data.universalMedicalRecord.createdAt,
                    updatedAt: response.data.universalMedicalRecord.updatedAt,
                };

                setProntuario(mappedProntuario);
            } catch (error) {
                console.error('Erro ao buscar prontuário:', error);
            }
        };

        if (prontuarioId) fetchProntuario();
    }, [prontuarioId]);

    return prontuario;
};
