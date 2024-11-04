import { createContext, useContext, useState } from "react";
import Patients from "./Patients";
import Register from "./Register";
import PatientRegisters from "./PatientRegisters";
import useSWR from 'swr'

type PatientsData = {

    name: string;
    age: number;
    id: string;
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
    patientsData: PatientsArray;
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

    const [page, setPage] = useState(0);

    const [patient, setPatient] = useState<PatientsData | undefined>(undefined)

    const [registers, setRegisters] = useState<RegisterArray | undefined>(undefined)

    const [register, setRegister] = useState<RegisterData | undefined>(undefined)

    const patientsData: PatientsArray = [

        {
            name: "Julia Moreira Cunha de Souza",
            age: 12,
            id: "10"

        },
        {
            name: "Gabriel Moreira Cunha de Souza",
            age: 10,
            id: "11"

        },
        {
            name: "Nataly Santiago Miranda Silva",
            age: 9,
            id: "12"

        },
        {
            name: "Robervaldo Oliveira Santos",
            age: 11,
            id: "13"

        },

    ]

    function selectPatient(patientId: string) {

        const patientSelected = patientsData?.find(pat => pat.id == patientId)
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
