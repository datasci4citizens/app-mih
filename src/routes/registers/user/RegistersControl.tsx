import { createContext, useContext, useState } from "react";
import Patients from "./Patients";
import Register from "./Register";
import PatientRegisters from "./PatientRegisters";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type PatientsData = {
    name: string,
    birthday: string,
    highFever: boolean,
    premature: boolean,
    deliveryProblems: boolean,
    lowWeight: boolean,
    deliveryType: string,
    brothersNumber: number,
    consultType: string,
    deliveryProblemsTypes: string,
    patient_id: number,
    created_at: string,
    updated_at: string
}

type PatientsArray = PatientsData[];

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
    patientsData: PatientsArray | undefined;
    selectPatient: (patientId: string) => void;
    setRegisters: (registers: RegisterArray) => void;
    registers: RegisterArray | undefined;
    selectRegister: (id: string) => void;
    register: RegisterData | undefined;
    patient: PatientsData | undefined;
    back: () => void;
}

const RegistersContext = createContext<RegistersContextType | undefined>(undefined);

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())

function SkeletonPatients() {

    return (
        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <ArrowLeft color="black" />
                    </Button>

                    <h1 className="text-3xl font-bold">Crianças</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />

                <Button className="text-center mt-[20px]" type="submit">
                    Adicionar criança
                </Button>

            </div>
        </div>
    )

}

export default function RegistersControl() {

    const { data, error, isLoading } = useSWR(`http://localhost:8000/users/10/patients/`, fetcher)

    const [page, setPage] = useState(0);

    const [patient, setPatient] = useState<PatientsData | undefined>(undefined)

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    if (isLoading)
        return <SkeletonPatients></SkeletonPatients>

    function selectPatient(patientId: string) {

        const patientSelected = patientsData?.find(pat => pat.patient_id == Number(patientId))
        setPatient(patientSelected)
        setPage(1);

    }

    function selectRegister(registerId: string) {

        const register = registers?.find(reg => String(reg.mih_id) == registerId)
        setRegister(register)
        setPage(2);

    }

    function back() {

        setPage((v) => {

            if (v != 0)
                return v - 1;

            return v;

        })

    }

    const patientsData: PatientsArray = data


    const pages = [

        <Patients />,
        <PatientRegisters />,
        <Register />,

    ]

    return (
        <RegistersContext.Provider
            value={{
                patientsData,
                selectPatient,
                setRegisters,
                registers,
                selectRegister,
                register,
                patient,
                back
            }}>
            {pages[page]}
        </RegistersContext.Provider>
    )

}

export const useRegistersContext = () => {
    const context = useContext(RegistersContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
