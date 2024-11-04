
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookPlus, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext } from "./RegistersControl";

export default function Patients() {

    const { patientsData, selectPatient } = useFormContext();

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
                                    <Button className="gap-2" onClick={() => selectPatient(value.id)}>
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