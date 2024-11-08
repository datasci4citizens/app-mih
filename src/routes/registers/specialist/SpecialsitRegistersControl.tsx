import { createContext, useContext, useState } from "react";
import SkeletonLoading from "../user/SkeletonLoading";
import PendingRegisters from "./PendingRegisters";
import RegisterDiagnostic from "./RegisterDiagnostic";
import useSWR from "swr";

type RegisterData = {
    start_date: string,
    end_date: string,
    painLevel: number,
    sensitivityField: boolean,
    stain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string,
    specialistObservations: string,
    diagnosis: string
    mih_id: number;
}

type RegisterArray = RegisterData[];

interface RegistersContextType {
    setRegisters: (registers: RegisterArray) => void;
    registers: RegisterArray | undefined;
    selectRegister: (id: string) => void;
    register: RegisterData | undefined;
    back: () => void;
}

const SpecialistRegistersContext = createContext<RegistersContextType | undefined>(undefined);

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())

export default function SpecialistRegistersControl() {

    const { data, error, isLoading } = useSWR(`http://localhost:8000/patients/${10}/mih`, fetcher)

    const [page, setPage] = useState(0);

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    if (error)
        return <h1>error</h1>
    if (isLoading)
        return <SkeletonLoading />

    if (!registers && data.mih.length > 0)
        setRegisters(data.mih)

    function selectRegister(registerId: string) {

        const register = registers?.find(reg => String(reg.mih_id) == registerId)
        setRegister(register)
        setPage(1);
    }

    function setDiagnostic(mid_id: number) {



    }

    function back() {

        setPage((v) => {

            if (v != 0)
                return v - 1;

            return v;

        })

    }

    const pages = [
        <PendingRegisters />,
        <RegisterDiagnostic />
    ]

    return (
        <SpecialistRegistersContext.Provider
            value={{
                setRegisters,
                registers,
                selectRegister,
                register,
                back
            }}>
            {pages[page]}
        </SpecialistRegistersContext.Provider>
    )

}

export const useSpecialistRegistersContext = () => {
    const context = useContext(SpecialistRegistersContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
