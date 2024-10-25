// src/hooks/useFetchClinico.ts
import { useEffect, useState } from 'react';
import api from '../services/api'; // Ajuste o caminho de acordo com sua estrutura de arquivos

interface ClinicianProps {
    id: string;
    name?: string;
    surname?: string;
    gender?: string;
    occupation?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
}

export const useClinicians = () => {
    const [clinicians, setClinicians] = useState<ClinicianProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [clinicianId, setClinicianId] = useState<string | null>(null); // Armazena o ID do clínico encontrado

    // Função para buscar todos os clínicos
    const fetchClinicians = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await api.get('/clinicians', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setClinicians(response.data.clinicians);
            console.log("Clinicians fetched:", response.data.clinicians); // Adiciona este log
        } catch (error) {
            console.error('Erro ao buscar os clínicos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar o ID do clínico com base no e-mail
    const fetchClinicianIdByEmail = (email: string) => {
        const matchedClinician = clinicians.find((clinician) => clinician.email === email);
        if (matchedClinician) {
            setClinicianId(matchedClinician.id); // Assume que a propriedade 'id' é o que você precisa
            console.log("Clinician ID found:", matchedClinician.id); // Log para verificação
        } else {
            console.error('Clinician não encontrado para o e-mail:', email);
            setClinicianId(null); // Reseta o ID se não encontrado
        }
    };

    useEffect(() => {
        fetchClinicians();
    }, []);

    // useEffect para buscar o ID do clínico assim que os clínicos forem buscados
    useEffect(() => {
        const email = localStorage.getItem('user_email'); // Ajuste a chave de acordo com o que você usa
        if (email) {
            fetchClinicianIdByEmail(email);
        }
    }, [clinicians]); // Executa quando a lista de clínicos mudar

    return { clinicians, loading, clinicianId, fetchClinicianIdByEmail };
};
