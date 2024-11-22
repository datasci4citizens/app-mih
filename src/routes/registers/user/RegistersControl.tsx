import { createContext, useContext, useState } from "react";
import Patients from "./Patients";
import Register from "./Register";
import PatientRegisters from "./PatientRegisters";
import useSWR from "swr";
import SkeletonLoading from "./SkeletonLoading";

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


export default function RegistersControl() {

    const { data, error, isLoading } = useSWR(`/users/10/patients/`)

    const [page, setPage] = useState(0);

    const [patient, setPatient] = useState<PatientsData | undefined>(undefined)

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    if (error)
        return <h1>error</h1>
    if (isLoading)
        return <SkeletonLoading />

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

            if (v != 0) {
                if (v == 1) {

                    setRegisters(undefined);
                    setPatient(undefined);
                }
                else if (v == 2)
                    setRegister(undefined);

                return v - 1;
            }

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
