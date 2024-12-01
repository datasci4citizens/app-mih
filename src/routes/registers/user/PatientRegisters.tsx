import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegistersContext } from "./RegistersControl";
import useSWR from 'swr';
import SkeletonLoading from "../../../lib/components_utils/SkeletonLoading";
import ErrorPage from "@/lib/components_utils/ErrorPage";

export default function PatientRegisters() {

    const { patient, selectRegister, back } = useRegistersContext();

    const { data, error, isLoading } = useSWR(`/patients/${patient?.patient_id}/mih`)

    if (isLoading) {
        return <SkeletonLoading />
    }
    if (error) {
        return <ErrorPage type="user"></ErrorPage>
    }

    if (data)
        return (

            <div className="min-h-screen max-h-screen overflow-auto">

                <div className="bg-[#0C4A6E] h-32 w-full"></div>

                <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                    <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                        <Button size={"icon"} onClick={back} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">

                            <ArrowLeft color="black" />

                        </Button>

                        <h1 className="text-3xl font-bold">Registros</h1>

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <User2Icon color="black" />
                        </Button>
                    </div>
                    {data.mih?.map((value: any, i: number) => {
                        return (<Card className="w-[100%] p-0" key={value.mih_id}>

                            <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                                <Card className="px-4 py-1 flex items-center justify-between">

                                    <div>
                                        <CardTitle className="text-lg w-[150px]">Registro {i + 1}</CardTitle>
                                        <CardDescription>{new Date(value.start_date).toLocaleDateString("pt-BR")}</CardDescription>
                                        {
                                            value.diagnosis && (
                                                <CardDescription>
                                                    {value?.diagnosis == "sugestive" ? "Sugestivo de HMI" : ""}
                                                    {value?.diagnosis == "presence" ? "Presença de HMI" : ""}
                                                    {value?.diagnosis == "absence" ? "Ausência de HMI" : ""}
                                                    {value?.diagnosis == "invalid" ? "Fotos inadequadas" : ""}</CardDescription>
                                            )

                                        }
                                    </div>


                                    <div className="flex gap-2">
                                        <Button className="gap-2" size={"icon"} onClick={() => selectRegister(String(value.mih_id), data.mih)}>
                                            <Eye />
                                        </Button>
                                    </div>

                                </Card>

                            </CardContent>
                        </Card>)
                    })

                    }

                    <Button className="text-center mt-[20px]" type="submit">
                        <Link to={`/user/registers/create-register/${patient?.patient_id}/new`}>Novo Registro</Link>
                    </Button>


                </div>
            </div>


        )

}