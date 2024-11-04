import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext } from "./CreateRegisterForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SelectPatientNew() {

    const { sendData, patientsData, selectPatient, next } = useFormContext();

    const { patient } = { ...sendData };

    return (

        <div className="min-h-screen max-h-screen overflow-scroll">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-center pt-[30px] rounded-t-3xl -mt-16 bg-white">

                <div className="flex w-[100%] justify-between items-center px-[30px] mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to={`/user/home`}>
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-center font-bold">
                            Selecione uma criança
                        </CardTitle>

                        <CardContent className="flex flex-col max-h-[600px] overflow-y-scroll p-[10px] gap-[10px] border-2 rounded-xl">
                            <RadioGroup defaultValue={patient.id} onValueChange={(e) => selectPatient(e)}>
                                {
                                    patientsData.map((child) =>

                                        <label htmlFor={child.id}>
                                            <Card className="px-4 flex max-w-[350px] items-center justify-center">
                                                <RadioGroupItem value={child.id} id={child.id} />
                                                <CardHeader>
                                                    <CardTitle>{child.name}</CardTitle>
                                                    {
                                                        true && (

                                                            <CardDescription className="font-semibold">Último registro: dd/mm/yyyy</CardDescription>
                                                        )
                                                    }
                                                </CardHeader>

                                            </Card>
                                        </label>

                                    )

                                }

                            </RadioGroup>
                        </CardContent>
                    </CardHeader>

                </Card>

                <Button className="w-[300px] text-center my-4" type="submit" onClick={() => {
                    if (patient.id !== "")
                        next();
                }}>
                    Próximo
                </Button>


            </div>
        </div >


    )

}