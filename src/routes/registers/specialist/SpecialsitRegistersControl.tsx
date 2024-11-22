import { createContext, useContext, useState } from "react";
import SkeletonLoading from "../../../lib/components_utils/SkeletonLoading";
import PendingRegisters from "./PendingRegisters";
import RegisterDiagnostic from "./RegisterDiagnostic";
import useSWR from "swr";
import useSWRMutation from 'swr/mutation'
import ErrorPage from "@/lib/components_utils/ErrorPage";

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

async function sendRequest(url: string, { arg }: {
    arg: { diagnosis: string, specialistObservations: string }
}) {


    console.log('=== sending request to ===')
    console.log(url)
    return await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

export default function SpecialistRegistersControl() {

    const { data, error, isLoading, mutate } = useSWR('/mih/undiagnosed');

    const [page, setPage] = useState(0);

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    const { trigger, data: sendData, error: isError } = useSWRMutation(`http://localhost:8000/mih/${register?.mih_id}`, sendRequest)

    if (isLoading) {
        return <SkeletonLoading />
    }
    if (error) {
        return <ErrorPage type="specialist"></ErrorPage>
    }

    if (!registers && data.length > 0)
        setRegisters(data)

    const handleDiagnosis = async () => {

        try {

            const newData = await fetch('http://127.0.0.1:8000/mih/undiagnosed', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json());


            mutate(newData);
            setRegisters(data);
        } catch (err) {
            console.error('Erro ao diagnosticar:', err);
        }
    };


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

        await trigger({ "diagnosis": register.diagnosis, "specialistObservations": register.specialistObservations });

        if (isError)
            return <ErrorPage type="specialist"></ErrorPage>

        console.log(sendData)

        const newRegisters = registers?.filter((reg) => reg.mih_id != register.mih_id);

        setRegisters(newRegisters);

        if (registers !== undefined)
            if (registers.length < 6)
                handleDiagnosis()

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
