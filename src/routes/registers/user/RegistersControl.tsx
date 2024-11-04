import { createContext, useContext, useState } from "react";
import Patients from "./Patients";
import Register from "./Register";
import PatientRegisters from "./PatientRegisters";

type PatientsData = {

    name: string;
    age: number;
    id: string;
}

type PatientsArray = PatientsData[];

type RegisterData = {

    register: string;
    createDate: string;
    diagostic: string;
    id: string;

}

type RegisterArray = RegisterData[];

interface RegistersContextType {
    patientsData: PatientsArray;
    selectPatient: (patientId: string) => void;
    registers: RegisterArray;
    selectRegister: (id: string) => void;
    register: RegisterData;
    patient: PatientsData;
    back: () => void;
}

const RegistersContext = createContext<RegistersContextType | undefined>(undefined);

export default function RegistersControl() {

    const [page, setPage] = useState(0);

    const [patient, setPatient] = useState({
        name: "",
        age: 0,
        id: ""

    })

    const [registers, setRegisters] = useState([{
        register: "",
        createDate: "",
        diagostic: "",
        id: ""

    }])

    const [register, setRegister] = useState({
        register: "",
        createDate: "",
        diagostic: "",
        id: ""
    })

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

    const allRegisters: RegisterArray = [

        {
            register: "1",
            createDate: "dd/mm/yyyy",
            diagostic: "Presença de HMI",
            id: "10"

        },
        {
            register: "2",
            createDate: "dd/mm/yyyy",
            diagostic: "Ausência de HMI",
            id: "11"

        },
        {
            register: "3",
            createDate: "dd/mm/yyyy",
            diagostic: "",
            id: "12"

        },
        {
            register: "5",
            createDate: "dd/mm/yyyy",
            diagostic: "Presença de HMI",
            id: "13"

        },
        {
            register: "4",
            createDate: "dd/mm/yyyy",
            diagostic: "Sugestivo de HMI ",
            id: "13"

        },
    ]

    function selectPatient(patientId: string) {

        const patientSelected = patientsData.find(pat => pat.id == patientId)
        setPatient(patientSelected || {
            name: "",
            age: 0,
            id: ""
        })
        const patientRegisters = allRegisters.filter(reg => reg.id == patientId)
        setRegisters(patientRegisters);
        setPage(1);

    }

    function selectRegister(registerId: string) {

        const register = registers.find(reg => reg.register == registerId)
        setRegister(register || {
            register: "",
            createDate: "",
            diagostic: "",
            id: ""
        })
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
