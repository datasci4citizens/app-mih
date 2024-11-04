import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { useFormContext } from "./CreateRegisterForm";

export default function RegisterSumary() {

    const { sendData, back, goTo, submit } = useFormContext();

    const { patient, toothache, painLevel, sensitivity,
        toothStain, aestheticDiscomfort, userObservations } = { ...sendData }

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-center pt-[30px] justify-between rounded-t-3xl -mt-16 bg-white space-y-4 mb-10">

                <div className="flex w-[100%] justify-start items-center px-[30px] mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 " onClick={back}>
                        <ArrowLeft color="black" />
                    </Button>
                </div>
                <h1 className="font-bold text-4xl">Sumário</h1>

                <div className="w-full px-[30px] space-y-4">
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Criança Selecionada</CardTitle>
                            <Edit onClick={() => goTo(0)}></Edit>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                {patient}
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Informações finais</CardTitle>
                            <Edit onClick={() => goTo(1)}></Edit>
                        </CardHeader>
                        <CardContent className="space-y-2 divide-y-2 divide-primary/20">
                            <CardDescription>
                                <h1 className="text-lg font-bold text-primary">A criança sente dor nos dentes ? </h1>
                                <li className="text-base font-bold">{toothache ? "SIM" : "NÃO"}</li>
                            </CardDescription>
                            {toothache && <CardDescription>
                                <h1 className="text-lg font-bold text-primary">Nível da dor</h1>
                                <li className="text-base font-bold">
                                    {painLevel === 1 && "Leve"}
                                    {painLevel === 2 && "Moderada"}
                                    {painLevel === 3 && "Intensa"}
                                </li>
                            </CardDescription>}
                            <CardDescription>
                                <h1 className="text-lg font-bold text-primary">A criança tem sensibilidade nos dentes ?</h1>
                                <li className="text-base font-bold">{sensitivity ? "SIM" : "NÃO"}</li>
                            </CardDescription>
                            <CardDescription>
                                <h1 className="text-lg font-bold text-primary">A criança apresenta mancha nos dentes ?</h1>
                                <li className="text-base font-bold" >{toothStain ? "SIM" : "NÃO"}</li>
                            </CardDescription>
                            {toothStain && <CardDescription>
                                <h1 className="text-lg font-bold text-primary">A mancha gera desconforto estético ?</h1>
                                <li className="text-base font-bold">{aestheticDiscomfort ? "SIM" : "NÃO"}</li>
                            </CardDescription>}
                            {
                                userObservations && <CardDescription>
                                    <h1 className="text-lg font-bold text-primary">Observações</h1>
                                    <li className="text-base font-bold">{userObservations}</li>
                                </CardDescription>
                            }
                        </CardContent>
                    </Card>

                </div>

                <Button className="text-center" type={"submit"} onClick={submit}>
                    Enviar Registro
                </Button>

            </div>
        </div>

    )

}