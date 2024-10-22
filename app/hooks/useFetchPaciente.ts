import { useState, useEffect } from 'react';
import api from "../services/api";

interface Paciente {
    id: string;
    name: string;
    surname: string;
    cpf: string;
    gender: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
}

export const useFetchPaciente = (patientId: string | null) => {
    const [paciente, setPaciente] = useState<Paciente | null>(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get(`/patients/by-id/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const mappedPaciente: Paciente = {
                    id: response.data.patient.id,
                    name: response.data.patient.name,
                    surname: response.data.patient.surname,
                    cpf: response.data.patient.cpf,
                    gender: response.data.patient.gender,
                    birthDate: response.data.patient.birthDate,
                    phoneNumber: response.data.patient.phoneNumber,
                    email: response.data.patient.email,
                };

                setPaciente(mappedPaciente);
            } catch (error) {
                console.error('Erro ao buscar paciente:', error);
            }
        };

        if (patientId) fetchPaciente();
    }, [patientId]);

    return paciente;
};
