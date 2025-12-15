import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/ui/logout-button";
import useSWR from "swr";
import { Link } from "react-router-dom";


export default function PatientHomePage() {

    const { data: user } = useSWR('/user/me')

    return (

        <div className="min-h-screen">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center p-[30px] justify-between rounded-t-3xl -mt-16 bg-white">

                <div className="w-[95%]">
                    <div className="flex w-full items-center justify-between mt-2 mb-10">
                        <div className="w-10 h-10 shrink-0" aria-hidden="true" />
                        <h1 className="text-3xl font-bold text-center mx-2">Bem vindo, {user?.name ?? '...'}!</h1>
                        <LogoutButton />
                    </div>

                    <div className="mt-12 flex flex-col gap-[20px]">
                        <Card className="shadow-md" hoverScale={true}>
                            <Link to={`/user/home/hmi-informations`}>
                                <CardHeader>
                                    <CardTitle className="text-xl">Informações</CardTitle>
                                    <CardDescription>Tratamentos, cuidados e dicas para casos de HMI</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                        <Card className="shadow-lg" hoverScale={true}>
                            <Link to={`/user/registers`}>
                                <CardHeader>
                                    <CardTitle className="text-xl">Minhas crianças</CardTitle>
                                    <CardDescription>Crianças cadastradas, seus registros e criação de novos registros</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                        <Card className="shadow-lg" hoverScale={true}>
                            <Link to={`/user/create/patient`}>
                                <CardHeader>
                                    <CardTitle className="text-xl">Adicionar Criança</CardTitle>
                                    <CardDescription>Cadastre outra criança</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    )


}