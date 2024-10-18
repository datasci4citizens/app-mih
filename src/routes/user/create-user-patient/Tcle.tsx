import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";


export default function TCLE() {

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col  items-center p-[30px] justify-start rounded-t-3xl -mt-16 bg-white">

                <Card className="border-none shadow-none">
                    <CardHeader>

                        <CardTitle className="text-center">TCLE</CardTitle>

                    </CardHeader>

                    <CardContent className="mt-10 flex flex-col items-center ">
                        <CardDescription className="font-bold text-lg">

                            Na tela seguinte você cadastrará no nosso aplicativo.<br />
                            Você também é convidado(a) a participar de uma pesquisa.<br />
                            Se trata de uma pesquisa científica desenvolvida por Dentistas da FOP - Unicamp para melhorar o tratamento de HMI. <br /> <br />
                            Caso concorde com a participação coletaremos dados de forma anônima sobre o uso da plataforma. Seus dados, como nome, e-mail e telefone, não serão armazenados e coletados para a pesquisa.

                        </CardDescription>

                        <CardDescription className="font-bold text-lg text-center mt-10">

                            Participe, você ajudará a criar uma plataforma sempre melhor!

                        </CardDescription>

                        <Button className="mt-4">
                            Acessar o TCLE compelto
                        </Button>
                        <Link to="/user/create">
                            <Button className="mt-2">
                                Seguir
                            </Button>

                        </Link>


                    </CardContent>


                </Card>


            </div>

        </div>


    )

}