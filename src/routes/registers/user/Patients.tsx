import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookPlus, Edit, Eye, Trash, User2Icon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

type PatientsData = {

    name: string;
    age: number;
    id: string;
}

type PatientsProps = {

    patientsData: PatientsData[];
    setPatient: (patientId: string) => void;
}
export default function Patients({ patientsData, setPatient }: PatientsProps) {

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

                    <h1 className="text-3xl font-bold">Registros</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>
                {patientsData.map((value) =>

                    <Card className="w-[100%] p-0" key={value.id}>

                        <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                            <Card className="px-4 py-1 flex items-center justify-between">

                                <div>
                                    <CardTitle className="text-lg w-[150px]">{value.name}</CardTitle>
                                    <CardDescription>Idade {value.age} anos</CardDescription>
                                </div>


                                <div className="flex gap-2">
                                    <Button className="gap-2" onClick={() => setPatient(value.id)}>
                                        <h1>Ver Registros</h1>
                                        <BookPlus />
                                    </Button>

                                </div>

                            </Card>

                        </CardContent>
                    </Card>
                )

                }


                <Button className="w-[300px] text-center mt-[20px]" type="submit">
                    <Link to={`/user/registers/create-register`}>Novo Registro</Link>
                </Button>


            </div>
        </div>


    )

}