import type { UserConsentState } from '@/types/consent.types';

export type UserRole = 'responsible' | 'specialist' | '';

export interface UserContextData {
    name: string;
    email: string;
    role: UserRole;
    is_allowed: boolean;
    consent: UserConsentState;
    pending_actions: Record<string, any>; // Tipo específico de pending actions pode ser expandido futuramente
}
