import { useState, useEffect } from 'react';
import useSWR from 'swr';
import apiClient from '@/lib/axios';

interface Patient {
    name: string;
    birthday: string;
    patient_id: number;
}

interface Register {
    mih_id: number;
    start_date: string;
    diagnosis: string | null;
    patient_id: number;
}

export interface RegisterWithPatient extends Register {
    patientName: string;
}

/**
 * Custom hook to fetch all registers from all patients
 * Extracted from AllRegisters.tsx component
 */
export function useAllRegisters() {
    const { data: patientsData, error: patientsError, isLoading: patientsLoading } = useSWR<Patient[]>('/users/patients/');
    const [allRegisters, setAllRegisters] = useState<RegisterWithPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!patientsData) return;

        const fetchAllRegisters = async () => {
            try {
                setLoading(true);
                const promises = patientsData.map(async (patient) => {
                    try {
                        const response = await apiClient.get(`/patients/${patient.patient_id}/mih`);
                        if (response.data?.mih && Array.isArray(response.data.mih)) {
                            return response.data.mih.map((register: Register) => ({
                                ...register,
                                patient_id: patient.patient_id,
                                patientName: patient.name
                            }));
                        }
                        return [];
                    } catch (err) {
                        if (import.meta.env.VITE_DEV_MODE === 'true') {
                            console.error(`Error fetching registers for patient ${patient.patient_id}:`, err);
                        }
                        return [];
                    }
                });

                const results = await Promise.all(promises);
                const flattenedRegisters = results.flat();

                // Sort by date (most recent first)
                flattenedRegisters.sort((a, b) =>
                    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
                );

                setAllRegisters(flattenedRegisters);
                setLoading(false);
            } catch (err) {
                if (import.meta.env.VITE_DEV_MODE === 'true') {
                    console.error('Error fetching all registers:', err);
                }
                setError(true);
                setLoading(false);
            }
        };

        fetchAllRegisters();
    }, [patientsData]);

    return {
        allRegisters,
        loading: patientsLoading || loading,
        error: patientsError || error,
        totalRegisters: allRegisters.length,
        undiagnosedCount: allRegisters.filter(r => !r.diagnosis).length
    };
}
