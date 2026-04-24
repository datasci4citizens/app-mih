import useSWR from 'swr';
import type { Patient } from '@/types/patient.types';

/**
 * Custom hook to fetch user's patients
 * Simple wrapper around SWR for consistency
 */
export function usePatients() {
    const { data, error, isLoading, mutate } = useSWR<Patient[]>('/api/patients/my/');

    return {
        patients: data,
        isLoading,
        error,
        mutate
    };
}
