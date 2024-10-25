// app/hooks/useFetchRegistroMedicoUniversal.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

interface RegistroMedicoUniversal {
    patientId: string;
    profession: string;
    emergencyContactEmail: string;
    emergencyContactNumber: string;
    maritalStatus: string;
    height: number;
    weight: number;
    allergies: string[];
    medicationsInUse: string[];
    diagnosis: string[];
}

export const useFetchRegistroMedicoUniversal = (patientId: string | null) => {
    const [registroMedico, setRegistroMedico] = useState<RegistroMedicoUniversal | null>(null);

    useEffect(() => {
        const fetchRegistroMedico = async () => {
            if (!patientId) return;

            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get(`/universal-medical-record/by-patient-id/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Acesse os dados de universalMedicalRecord
                const data = response.data.universalMedicalRecord;

                const mappedRegistroMedico: RegistroMedicoUniversal = {
                    patientId: data.patientId,
                    profession: data.profession,
                    emergencyContactEmail: data.emergencyContactEmail,
                    emergencyContactNumber: data.emergencyContactNumber,
                    maritalStatus: data.maritalStatus,
                    height: data.height,
                    weight: data.weight,
                    allergies: data.allergies || [], // Garante que será um array mesmo se estiver vazio
                    medicationsInUse: data.medicationsInUse || [],
                    diagnosis: data.diagnosis || [],
                };

                setRegistroMedico(mappedRegistroMedico);
            } catch (error) {
                console.error('Erro ao buscar registro médico universal:', error);
            }
        };

        fetchRegistroMedico();
    }, [patientId]);

    return registroMedico;
};
