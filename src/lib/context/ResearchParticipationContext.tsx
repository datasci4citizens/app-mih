import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ResearchParticipationContextType {
    participatesInResearch: boolean | null;
    setParticipatesInResearch: (value: boolean) => void;
}

const ResearchParticipationContext = createContext<ResearchParticipationContextType>({
    participatesInResearch: null,
    setParticipatesInResearch: () => { },
});

export function ResearchParticipationProvider({ children }: { children: ReactNode }) {
    const [participatesInResearch, setParticipatesInResearch] = useState<boolean | null>(null);

    return (
        <ResearchParticipationContext.Provider value={{ participatesInResearch, setParticipatesInResearch }}>
            {children}
        </ResearchParticipationContext.Provider>
    );
}

export function useResearchParticipation() {
    return useContext(ResearchParticipationContext);
}
