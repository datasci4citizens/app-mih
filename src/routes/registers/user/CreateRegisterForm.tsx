import { useState } from "react"
import FinishRegisterNew from "./FinishRegisterNew"
import SelectPatientNew from "./SelectPatientNew"

type RegisterData = {

    patient: string,
    toothache: boolean,
    painLevel: "mild" | "moderate" | "intense" | "",
    sensitivity: boolean,
    toothStain: boolean,
    aestheticDiscomfort: boolean,
    observations: string

}

const INIT_DATA: RegisterData = {

    patient: "",
    toothache: false,
    painLevel: "",
    sensitivity: false,
    toothStain: false,
    aestheticDiscomfort: false,
    observations: ""

}

export default function CreateRegister() {

    const [data, setData] = useState(INIT_DATA)

    const updateFields = (fields: Partial<RegisterData>) => {

        setData(prev => {
            return { ...prev, ...fields }
        })

    }


    const [currentStepIndex, setCurrentStepIndex] = useState(1);

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

    const steps = [
        <SelectPatientNew {...data} updateFields={updateFields} next={next} />,
        <FinishRegisterNew {...data} updateFields={updateFields} next={next} back={back} />
    ]
    return (

        steps[currentStepIndex]

    )

}
