import { createContext, useContext, useState, useEffect } from "react"
import FinishRegisterNew from "./FinishRegisterNew"
import RegisterSummary from "./RegisterSummary"
import useSWRMutation from "swr/mutation"
import { useNavigate, useParams } from "react-router-dom"
import useSWR from "swr"
import ConfirmPatient from "./ConfirmPatient"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User2Icon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CaptureOne from "./CaptureOne"
import CaptureTwo from "./CaptureTwo"
import ErrorPage from "@/components/ErrorPage"
import apiClient from "@/lib/axios"
import { TaleUpdateGuard } from "@/guards/TaleUpdateGuard"
import { notifyApiError } from "@/lib/api-error"

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

    photo1: any;
    photo2: any;
    photo3: any;
    patient: PatientsData | undefined;
    toothache: boolean;
    painLevel: number;
    sensitivity: boolean;
    toothStain: boolean;
    aestheticDiscomfort: boolean;
    userObservations: string;

}

const INIT_DATA: RegisterData = {

    photo1: null,
    photo2: null,
    photo3: null,
    patient: undefined,
    toothache: false,
    painLevel: 0,
    sensitivity: false,
    toothStain: false,
    aestheticDiscomfort: false,
    userObservations: ""

}

type SendData = {

    photo_id1: number;
    photo_id2: number;
    photo_id3: number;
    patient: number;
    start_date: string;
    painLevel: number;
    sensitivityField: boolean;
    stain: boolean;
    aestheticDiscomfort: boolean;
    userObservations: string;
    specialistObservations: string | null;
    diagnosis: string | null;

}

interface FormContextType {
    sendData: RegisterData;
    patient_id: string | undefined;
    submitting: boolean;
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
    return apiClient.post(url, arg).then(res => res.data)
}

async function sendPhotoRequest(url: string, { arg }: {
    arg: File | Blob;
}) {
    const formData = new FormData();
    formData.append('file', arg, 'image.jpg');
    return apiClient.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
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

    const [submitting, setSubmitting] = useState(false)

    const { trigger } = useSWRMutation(`/api/mih/`, sendRequest)

    const { trigger: triggerPhoto, error: errorPhoto } = useSWRMutation(`/api/images/`, sendPhotoRequest)

    const { data: patientData, error: isError, isLoading } = useSWR(`/api/patients/${patient_id}`)

    const [sendData, setSendData] = useState(INIT_DATA)

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const navigate = useNavigate();

    // Reset patient data when patient_id changes
    useEffect(() => {
        if (patientData) {
            setSendData({
                ...INIT_DATA,
                patient: patientData
            });
            // Only skip confirmation step if explicitly coming from a place that should skip it
            // For now, we always show confirmation unless first_time is explicitly "new"
            if (first_time === "new") {
                setCurrentStepIndex(1);
            } else {
                setCurrentStepIndex(0);
            }
        }
    }, [patient_id, patientData, first_time]);

    if (isLoading) {
        return <IsLoading />
    }
    if (isError) {
        return <ErrorPage type="user"></ErrorPage>
    }


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

            if (currentStepIndex <= 0)
                return i;
            else
                return i - 1;

        })
    }

    const goTo = (index: number) => {

        setCurrentStepIndex(index);

    }

    async function submitImage(file: File | Blob) {

        const result = await triggerPhoto(file)

        return result.id;

    }

    async function submit() {
        try {
            setSubmitting(true);

            const id1 = await submitImage(sendData.photo1);
            const id2 = await submitImage(sendData.photo2);
            const id3 = await submitImage(sendData.photo3);

            if (errorPhoto && import.meta.env.VITE_DEV_MODE === 'true') {
                console.log(errorPhoto);
            }

            let arg: SendData = {
                "photo_id1": id1,
                "photo_id2": id2,
                "photo_id3": id3,
                "patient": Number(patient_id),
                "start_date": new Date().toISOString(),
                "painLevel": sendData.painLevel,
                "sensitivityField": sendData.sensitivity,
                "stain": sendData.toothStain,
                "aestheticDiscomfort": sendData.aestheticDiscomfort,
                "userObservations": sendData.userObservations,
                "specialistObservations": null,
                "diagnosis": null
            }

            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.log(arg)
            }

            const result = await trigger(arg)
            
            if (result) {
                setSubmitting(false);
                navigate(`/user/home/`);
            }
        } catch (err: any) {
            setSubmitting(false);
            console.error('Erro ao enviar dados:', err);

            notifyApiError(err, "Ocorreu um erro ao enviar os dados. Tente novamente mais tarde.");
        }
    }



    const steps = [
        <ConfirmPatient />,
        <CaptureOne />,
        <CaptureTwo />,
        <FinishRegisterNew />,
        <RegisterSummary />
    ]
    return (
        <TaleUpdateGuard patientData={patientData}>
            <FormContext.Provider value={{
                sendData,
                patient_id,
                submitting,
                updateFields,
                next,
                back,
                goTo,
                submit
            }}>
                {steps[currentStepIndex]}
            </FormContext.Provider>
        </TaleUpdateGuard>
    )

}

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
