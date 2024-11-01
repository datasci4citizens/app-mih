import { useState } from "react"
import FinishRegisterNew from "./FinishRegisterNew"
import SelectPatientNew from "./SelectPatientNew"
import RegisterSumary from "./RegisterSumary"
import useSWRMutation from "swr/mutation"
import { useNavigate } from "react-router-dom"

type RegisterData = {

    patient: string,
    toothache: boolean,
    painLevel: number,
    sensitivity: boolean,
    toothStain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string

}

const INIT_DATA: RegisterData = {

    patient: "",
    toothache: false,
    painLevel: -1,
    sensitivity: false,
    toothStain: false,
    aestheticDiscomfort: false,
    userObservations: ""

}

type SendData = {

    start_date: string,
    painLevel: number,
    sensitivityField: boolean,
    stain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string,
    specialistObservations: string,
    diagnosis: string,
    patient_id: number

}

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

export default function CreateRegister() {

    const { trigger, data, error } = useSWRMutation('http://localhost:8000/mih/', sendRequest)

    const [sendData, setSendData] = useState(INIT_DATA)

    const navigate = useNavigate();

    const updateFields = (fields: Partial<RegisterData>) => {

        setSendData(prev => {
            return { ...prev, ...fields }
        })

    }

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    function next() {

        setCurrentStepIndex(i => {

            if (currentStepIndex >= 2)
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


    async function submit() {

        let arg: SendData = {
            "start_date": new Date().toISOString(),
            "painLevel": sendData.painLevel,
            "sensitivityField": sendData.sensitivity,
            "stain": sendData.toothStain,
            "aestheticDiscomfort": sendData.aestheticDiscomfort,
            "userObservations": sendData.userObservations,
            "specialistObservations": "",
            "diagnosis": "",
            "patient_id": 10
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

    const steps = [
        <SelectPatientNew {...sendData} updateFields={updateFields} next={next} />,
        <FinishRegisterNew {...sendData} updateFields={updateFields} next={next} back={back} />,
        <RegisterSumary {...sendData} back={back} goTo={goTo} submit={submit} />
    ]
    return (

        steps[currentStepIndex]

    )

}
