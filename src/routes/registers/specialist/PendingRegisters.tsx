import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSpecialistRegistersContext } from "./SpecialsitRegistersControl";
import useSWR from "swr";
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
    diagnosis: string
    mih_id: number;
}

export default function PendingRegisters() {

    const { data, selectRegister } = useSpecialistRegistersContext()

    function getPatientByMih(mih_id: number) {

        const { data, error, isLoading } = useSWR(`/mih/${mih_id}`);

        if (error)
            return <ErrorPage type="specialist"></ErrorPage>

        if (!isLoading)
            return data.patient.name

    }

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Link to="/specialist/home">
                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <ArrowLeft color="black" />
                        </Button>
                    </Link>

                    <h1 className="text-3xl font-bold">Avaliações</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>
                {data?.map((value: RegisterData) => {
                    return (
                        <Card className="w-[100%] p-0" key={value.mih_id}>

                            <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                                <Card className="px-4 py-1 flex items-center justify-between">

                                    <div>
                                        <CardTitle className="text-lg w-[150px]">{getPatientByMih(value.mih_id)}</CardTitle>
                                        <CardDescription>{new Date(value.start_date).toLocaleDateString("pt-BR")}</CardDescription>
                                        {
                                            value.diagnosis && (
                                                <CardDescription>{value.diagnosis}</CardDescription>
                                            )

                                        }
                                    </div>


                                    <div className="flex gap-2">
                                        <Button className="gap-2" size={"icon"} onClick={() => selectRegister(String(value.mih_id))}>
                                            <Eye />
                                        </Button>
                                    </div>

                                </Card>

                            </CardContent>
                        </Card>)
                })

                }

            </div>
        </div>
    )

}