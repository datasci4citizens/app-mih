import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookPlus, Edit, Eye, Trash, User2Icon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function PatientRegisters() {

    const { id } = useParams();

    const children = [

        {
            register: "1",
            createDate: "dd/mm/yyyy",
            diagostic: "Presença de HMI",
            id: 10

        },
        {
            register: "2",
            createDate: "dd/mm/yyyy",
            diagostic: "Ausência de HMI",
            id: 11

        },
        {
            register: "3",
            createDate: "dd/mm/yyyy",
            diagostic: "",
            id: 12

        },
        {
            register: "5",
            createDate: "dd/mm/yyyy",
            diagostic: "Presença de HMI",
            id: 13

        },
        {
            register: "4",
            createDate: "dd/mm/yyyy",
            diagostic: "Sugestivo de HMI ",
            id: 13

        },
    ]

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to={`/user/registers/${id}`}>
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
                {children.map((value) => {
                    if (value.id == Number(id))
                        return (<Card className="w-[100%] p-0" key={value.id}>

                            <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                                <Card className="px-4 py-1 flex items-center justify-between">

                                    <div>
                                        <CardTitle className="text-lg w-[150px]">Registro {value.register}</CardTitle>
                                        <CardDescription>{value.createDate}</CardDescription>
                                        {
                                            value.diagostic && (
                                                <CardDescription>{value.diagostic}</CardDescription>
                                            )

                                        }
                                    </div>


                                    <div className="flex gap-2">
                                        <Link to={`/user/registers/register/${value.id}`}>
                                            <Button className="gap-2" size={"icon"}>
                                                <Eye />
                                            </Button>
                                        </Link>
                                    </div>

                                </Card>

                            </CardContent>
                        </Card>)
                }
                )

                }


                <Button className="w-[300px] text-center mt-[20px]" type="submit">
                    <Link to={`/user/registers/new-register/${id}`}>Novo Registro</Link>
                </Button>


            </div>
        </div>


    )

}