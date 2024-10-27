// src/context/FormContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Tipos para os dados de cada etapa do formulário
interface Step1Data {
    patient?: string
}

interface Step2Data {
    // Adicione os campos da etapa 2 aqui, como:
    // age?: number;
}

// Tipo completo do estado global do formulário
interface FormData {
    step1: Step1Data;
    step2: Step2Data;
}

// Tipo para o contexto, incluindo a função de atualização
interface FormContextType {
    formData: FormData;
    updateFormData: (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => void;
}

// Criação do contexto com o tipo específico
const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook para usar o contexto
export const useFormContext = (): FormContextType => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext deve ser usado dentro de FormProvider');
    }
    return context;
};

// Tipo para as props do provedor
interface FormProviderProps {
    children: ReactNode;
}

// Componente do provedor de contexto
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({
        step1: {},
        step2: {},
    });

    const updateFormData = (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
        setFormData((prevData) => ({
            ...prevData,
            [step]: {
                ...prevData[step],
                ...data,
            },
        }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};