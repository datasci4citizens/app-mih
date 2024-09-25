import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { Link } from "react-router-dom";


export default function PatientHomePage() {


    return (
        <div className="flex flex-col min-h-screen items-center p-[30px] justify-between">

            <div>
                <div className="flex w-[100%] justify-end mb-[20%]">
                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/patient-home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-[20px]">
                    <Card className="shadow-lg">
                        <Link to="/patient-home/informations">
                            <CardHeader>
                                <CardTitle className="text-xl">Informações</CardTitle>
                                <CardDescription>Tratamentos, cuidados e dicas para casos de HMI</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                    <Card className="shadow-lg">
                        <Link to="/patient-home/informations">
                            <CardHeader>
                                <CardTitle className="text-xl">Meus Registros</CardTitle>
                                <CardDescription>Histórico de fotos e observações da arcada dentária</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                    <Card className="shadow-lg">
                        <Link to="/user/create/patient/child">
                            <CardHeader>
                                <CardTitle className="text-xl">Adicionar Criança</CardTitle>
                                <CardDescription>Cadastre outra criança</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>

            </div>

            <div className="w-[100%]">
                <Button className="w-[100%] bg-[#0F172A] hover:bg-[#0F172A]/90 ">Novo Registro</Button>
            </div>

        </div>
    )


}