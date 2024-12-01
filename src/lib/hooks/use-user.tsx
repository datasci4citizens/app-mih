import { createContext, useContext } from "react";

const ctx = createContext({
    name: "",
    email: "",
    role: "",
    is_allowed: true,
})

export const UserContextProvider = ctx.Provider;

export const useUser = () => {
    return useContext(ctx)
}