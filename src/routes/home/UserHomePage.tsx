import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { Link } from "react-router-dom";


export default function PatientHomePage() {


    return (

        <div className="min-h-screen">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center p-[30px] justify-between rounded-t-3xl -mt-16 bg-white">

                <div>
                    <div className="flex w-[100%] justify-end  my-10">
                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home/profile">
                                <User2Icon color="black" />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-[20px]">
                        <Card className="shadow-lg">
                            <Link to="/user/home/hmi-informations">
                                <CardHeader>
                                    <CardTitle className="text-xl">Informações</CardTitle>
                                    <CardDescription>Tratamentos, cuidados e dicas para casos de HMI</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                        <Card className="shadow-lg">
                            <Link to="/user/registers">
                                <CardHeader>
                                    <CardTitle className="text-xl">Meus Registros</CardTitle>
                                    <CardDescription>Histórico de fotos e observações da arcada dentária</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                        <Card className="shadow-lg">
                            <Link to="/user/create/patient">
                                <CardHeader>
                                    <CardTitle className="text-xl">Adicionar Criança</CardTitle>
                                    <CardDescription>Cadastre outra criança</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    </div>

                </div>

                <div className='flex absolute inset-x-0 justify-center bottom-[40px]'>
                    <Button className="w-[300px] text-center" type="submit">
                        <Link to="/user/registers/new-register">Novo Registro</Link>
                    </Button>
                </div>

            </div>
        </div>
    )


}