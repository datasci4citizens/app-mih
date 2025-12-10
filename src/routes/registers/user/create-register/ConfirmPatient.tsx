import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext } from "./CreateRegisterForm";

export default function ConfirmPatient() {

    const { sendData, updateFields, next } = useFormContext();

    const { patient } = { ...sendData };

    return (

        <div className="min-h-screen max-h-screen overflow-scroll">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-center pt-[30px] rounded-t-3xl -mt-16 bg-white">

                <div className="flex w-[100%] justify-between items-center px-[30px] mt-2">

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

                <Card className="shadow-none border-none">
                    <CardHeader className="text-center">
                        <CardTitle>
                            Você deseja criar agora um registro para a criança abaixo ?
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {patient?.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 divide-y-2 divide-primary/20">
                                <CardDescription>
                                    Data de nascimento: {new Date(patient?.birthday || "").toLocaleDateString('pt-BR')}
                                </CardDescription>
                                {(patient?.brothersNumber || 0) > 0 &&
                                    (
                                        <CardDescription>
                                            Número de irmãos: {patient?.brothersNumber}
                                        </CardDescription>
                                    )
                                }
                                <CardDescription>
                                    Teve febre alta ou infecção até os 3 anos: {patient?.highFever ? "Sim" : "Não"}
                                </CardDescription>
                                <CardDescription>
                                    Teve nascimento prematuro: {patient?.premature ? "Sim" : "Não"}
                                </CardDescription>
                                <CardDescription>
                                    Teve baixo peso ao nascer: {patient?.lowWeight ? "Sim" : "Não"}
                                </CardDescription>
                                <CardDescription>
                                    Tipo de parto: {patient?.deliveryType == "normal" ? "Normal" : "Cesárea"}
                                </CardDescription>
                                {
                                    patient?.consultType !== "" &&
                                    (
                                        <CardDescription>
                                            Já teve atendimento odontológico {patient?.consultType == "public" ? "público" : "particular"}
                                        </CardDescription>
                                    )
                                }
                            </CardContent>
                        </Card>

                        <CardDescription className="text-center">
                            Caso não seja possível criar o registro neste momento você pode criar mais tarde selecionando esta criança na seção de <b>Minhas crianças</b>
                        </CardDescription>

                    </CardContent>

                </Card>

                <Button className="text-center my-4" type="submit" onClick={() => {
                    if (patient?.name == "")
                        updateFields({ patient: patient });
                    next();
                }}>
                    Criar agora
                </Button>

                <Link to="/user/home">
                    <Button variant={"destructive"}>
                        Criar mais tarde
                    </Button>
                </Link>


            </div>
        </div >


    )

}