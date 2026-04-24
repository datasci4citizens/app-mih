import { createContext, useContext } from "react";
import type { UserConsentState } from "@/types/consent.types";
import type { UserContextData } from "@/types/user.types";

const defaultConsentState: UserConsentState = {
    tcle: {
        accepted: false,
        accepted_at: null,
        ip_address: null,
        document_version: null,
        document_language: null,
        document_hash: null,
        effective_date: null,
    },
    privacy_policy: {
        accepted: false,
        accepted_at: null,
        ip_address: null,
        document_version: null,
        document_language: null,
        document_hash: null,
        effective_date: null,
    },
};

const defaultUserContextData: UserContextData = {
    name: "",
    email: "",
    role: "",
    is_allowed: true,
    consent: defaultConsentState,
    pending_actions: {},
};

const ctx = createContext<UserContextData>(defaultUserContextData)

export const UserContextProvider = ctx.Provider;

export const useUser = () => {
    return useContext(ctx)
}