
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookPlus, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegistersContext } from "./RegistersControl";

export default function Patients() {

    const { patientsData, selectPatient } = useRegistersContext();

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to={`/user/home`}>
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold">Crianças</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>
                {patientsData.map((value) =>

                    <Card className="w-[100%] p-0" key={value.id}>

                        <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                            <Card className="px-0 py-0 flex flex-col items-center justify-between">

                                <div className="m-2 text-center">
                                    <CardTitle className="text-lg">{value.name}</CardTitle>
                                    <CardDescription>Último registro: dd/mm/yyy</CardDescription>
                                </div>

                                <Button className="gap-2 w-full rounded-t-none" onClick={() => selectPatient(value.id)}>
                                    <h1>Registros</h1>
                                    <BookPlus />
                                </Button>



                            </Card>

                        </CardContent>
                    </Card>
                )

                }


                <Button className="text-center mt-[20px]" type="submit">
                    <Link to={`/user/create/patient`}>Adicionar criança</Link>
                </Button>


            </div>
        </div>


    )

}