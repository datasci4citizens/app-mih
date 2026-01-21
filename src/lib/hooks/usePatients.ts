import useSWR from 'swr';

interface Patient {
    name: string;
    birthday: string;
    patient_id: number;
}

/**
 * Custom hook to fetch user's patients
 * Simple wrapper around SWR for consistency
 */
export function usePatients() {
    const { data, error, isLoading, mutate } = useSWR<Patient[]>('/users/patients/');

    return {
        patients: data,
        isLoading,
        error,
        mutate
    };
}
