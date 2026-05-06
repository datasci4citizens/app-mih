import { AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react';

/**
 * Diagnosis information type
 */
export interface DiagnosisInfo {
    label: string;
    risk: string;
    color: string;
    bg: string;
    icon: LucideIcon;
}

/**
 * Get diagnosis information with visual styling
 * @param diagnosis - Diagnosis string or null
 * @returns Diagnosis information object
 */
export function getDiagnosisInfo(diagnosis: string | null): DiagnosisInfo {
    switch (diagnosis) {
        case 'presence':
            return {
                label: 'Presença de HMI',
                risk: 'Alto',
                color: 'text-red-500',
                bg: 'bg-red-50',
                icon: AlertCircle
            };
        case 'sugestive':
            return {
                label: 'Sugestivo de HMI',
                risk: 'Médio',
                color: 'text-yellow-500',
                bg: 'bg-yellow-50',
                icon: AlertCircle
            };
        case 'absence':
            return {
                label: 'Ausência de HMI',
                risk: 'Baixo',
                color: 'text-green-500',
                bg: 'bg-green-50',
                icon: CheckCircle2
            };
        case 'invalid':
            return {
                label: 'Fotos inadequadas',
                risk: 'Inválido',
                color: 'text-gray-500',
                bg: 'bg-gray-50',
                icon: AlertCircle
            };
        default:
            return {
                label: 'Aguardando diagnóstico',
                risk: 'Pendente',
                color: 'text-orange-500',
                bg: 'bg-orange-50',
                icon: AlertCircle
            };
    }
}
