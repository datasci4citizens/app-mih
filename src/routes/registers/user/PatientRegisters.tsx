import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegistersContext } from "./RegistersControl";
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function PatientRegisters() {

    const { patient, registers, setRegisters, selectRegister, back } = useRegistersContext();

    const { data, error, isLoading } = useSWR(`http://localhost:8000/patients/${patient?.id}/mih`, fetcher)

    if (error)
        return <h1>{error}</h1>
    if (isLoading)
        return <h1>loading</h1>

    setRegisters(data.mih)

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
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>
                {registers?.map((value, i) => {
                    return (<Card className="w-[100%] p-0" key={value.mih_id}>

                        <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                            <Card className="px-4 py-1 flex items-center justify-between">

                                <div>
                                    <CardTitle className="text-lg w-[150px]">Registro {i + 1}</CardTitle>
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
                }
                )

                }


                <Button className="text-center mt-[20px]" type="submit">
                    <Link to={`/user/registers/create-register`}>Novo Registro</Link>
                </Button>


            </div>
        </div>


    )

}