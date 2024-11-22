import { createContext, useContext, useState } from "react"
import FinishRegisterNew from "./FinishRegisterNew"
import RegisterSumary from "./RegisterSumary"
import useSWRMutation from "swr/mutation"
import { useNavigate, useParams } from "react-router-dom"
import useSWR from "swr"
import ConfirmPatient from "./ConfirmPatient"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User2Icon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CaptureOne from "./CaptureOne"
import CaptureTwo from "./CaptureTwo"

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
}

type RegisterData = {

    photo1: string;
    photo2: string;
    photo3: string;
    patient: PatientsData | undefined;
    toothache: boolean;
    painLevel: number;
    sensitivity: boolean;
    toothStain: boolean;
    aestheticDiscomfort: boolean;
    userObservations: string;

}

const INIT_DATA: RegisterData = {

    photo1: "",
    photo2: "",
    photo3: "",
    patient: undefined,
    toothache: false,
    painLevel: 0,
    sensitivity: false,
    toothStain: false,
    aestheticDiscomfort: false,
    userObservations: ""

}

type SendData = {

    start_date: string;
    painLevel: number;
    sensitivityField: boolean;
    stain: boolean;
    aestheticDiscomfort: boolean;
    userObservations: string;
    specialistObservations: string;
    diagnosis: string | null;

}

interface FormContextType {
    sendData: RegisterData;
    patient_id: string | undefined;
    updateFields: (fields: Partial<RegisterData>) => void;
    next: () => void;
    back: () => void;
    goTo: (index: number) => void;
    submit: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

async function sendRequest(url: string, { arg }: {
    arg: SendData;
}) {
    console.log('=== sending request to ===')
    console.log(url)
    console.log(arg)
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

function IsLoading() {

    return (
        <div className="min-h-screen max-h-screen overflow-scroll">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-center pt-[30px] rounded-t-3xl -mt-16 bg-white">

                <div className="flex w-[100%] justify-between items-center px-[30px] mt-2 mb-10">
                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <ArrowLeft color="black" />
                    </Button>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <Skeleton className="h-[250px] w-[80%] rounded-xl " />

            </div>
        </div >
    )

}

export default function CreateRegister() {

    const { patient_id, first_time } = useParams();

    const { trigger, data, error } = useSWRMutation(`http://localhost:8000/${patient_id}/mih`, sendRequest)

    const { data: patientData, error: isError, isLoading } = useSWR(`/patients/${patient_id}`)

    const [sendData, setSendData] = useState(INIT_DATA)

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const navigate = useNavigate();

    if (isError)
        return <h1>Error</h1>

    if (isLoading)
        return <IsLoading />


    const updateFields = (fields: Partial<RegisterData>) => {

        setSendData(prev => {
            return { ...prev, ...fields }
        })

    }

    function next() {

        setCurrentStepIndex(i => {

            if (currentStepIndex >= 4)
                return i;
            else
                return i + 1;

        })
    }

    const back = () => {

        setCurrentStepIndex(i => {

            if (currentStepIndex <= 1)
                return i;
            else
                return i - 1;

        })
    }

    const goTo = (index: number) => {

        setCurrentStepIndex(index);

    }


    async function submit() {

        let arg: SendData = {
            "start_date": new Date().toISOString(),
            "painLevel": sendData.painLevel,
            "sensitivityField": sendData.sensitivity,
            "stain": sendData.toothStain,
            "aestheticDiscomfort": sendData.aestheticDiscomfort,
            "userObservations": sendData.userObservations,
            "specialistObservations": "",
            "diagnosis": null
        }


        console.log(arg)

        const result = await trigger(arg)

        if (result && !error) {
            navigate(`/user/home/`); // Redireciona para a home
        } else {
            console.error('Erro ao enviar dados:', error);
        }

        console.log(data)
    }

    if (!sendData.patient) {
        updateFields({ patient: patientData })
        if (first_time == "new")
            next()
    }

    const steps = [
        <ConfirmPatient />,
        <CaptureOne />,
        <CaptureTwo />,
        <FinishRegisterNew />,
        <RegisterSumary />
    ]
    return (

        <FormContext.Provider value={{
            sendData,
            patient_id,
            updateFields,
            next,
            back,
            goTo,
            submit
        }}>
            {steps[currentStepIndex]}
        </FormContext.Provider>

    )

}

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
