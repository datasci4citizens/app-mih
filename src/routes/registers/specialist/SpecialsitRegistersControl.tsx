import { createContext, useContext, useState } from "react";
import SkeletonLoading from "../user/SkeletonLoading";
import PendingRegisters from "./PendingRegisters";
import RegisterDiagnostic from "./RegisterDiagnostic";
import useSWR from "swr";
import useSWRMutation from 'swr/mutation'

type RegisterData = {
    start_date: string,
    end_date: string,
    painLevel: number,
    sensitivityField: boolean,
    stain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string,
    specialistObservations: string,
    diagnosis: string;
    mih_id: number;
}

type RegisterArray = RegisterData[];

interface RegistersContextType {
    setRegisters: (registers: RegisterArray) => void;
    registers: RegisterArray | undefined;
    submitRegister: () => void;
    setObservation: (observation: string) => void;
    setDiagnostic: (diagnosis: string) => void;
    selectRegister: (id: string) => void;
    register: RegisterData | undefined;
    back: () => void;
}

const SpecialistRegistersContext = createContext<RegistersContextType | undefined>(undefined);

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())

async function sendRequest(url: string, { arg }: {
    arg: RegisterData
}) {


    console.log('=== sending request to ===')
    console.log(url)
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

export default function SpecialistRegistersControl() {

    const { data, error, isLoading } = useSWR(`http://127.0.0.1:8000/mih/undiagnosed`, fetcher)

    const [page, setPage] = useState(0);

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    const { trigger, data: sendData, error: isError } = useSWRMutation(`http://localhost:8000/mih/${register?.mih_id}`, sendRequest)

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

    function setDiagnostic(diagnosis: string) {

        setRegister((prevRegister) => {
            if (!prevRegister) {
                return undefined;
            }

            return {
                ...prevRegister,
                diagnosis: diagnosis,
            };
        });


    }

    function setObservation(observation: string) {

        setRegister((prevRegister) => {
            if (!prevRegister) {
                return undefined;
            }

            return {
                ...prevRegister,
                specialistObservations: observation,
            };
        });


    }

    function back() {

        setPage((v) => {

            if (v != 0)
                return v - 1;

            return v;

        })

    }

    async function submitRegister() {

        if (!register) {

            return undefined;
        }

        if (register.diagnosis == null) {

            return undefined;
        }

        await trigger(register);

        back()

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
                submitRegister,
                setObservation,
                setDiagnostic,
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
