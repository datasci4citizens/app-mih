export interface Patient {
    id: number;
    patient_id: number; // Suporte mantido para compatibilidade passada no frontend e backend
    name: string;
    birthday: string | null;
    user_id: number | null;
    created_at?: string | null;
    updated_at?: string | null;

    // Clinical/Non-Clinical Info
    highFever?: boolean | null;
    premature?: boolean | null;
    deliveryProblems?: boolean | null;
    lowWeight?: boolean | null;
    deliveryType?: string | null;
    brothersNumber?: number | null;
    consultType?: string | null;
    deliveryProblemsTypes?: string | null;

    // Consent TALE
    tale_document_id?: number | null;
    tale_document_hash?: string | null;
    tale_document_version?: string | null;
    tale_accepted?: boolean | null;
    tale_accepted_at?: string | null;
}
