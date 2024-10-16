import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export default function SelectPatientNew() {

    return (

        <div>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col min-h-screen max-h-screen overflow-scroll items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white">

                <div>
                    <div className="flex w-[100%] justify-between items-center my-10">

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home">
                                <ArrowLeft color="black" />
                            </Link>
                        </Button>

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home/profile">
                                <User2Icon color="black" />
                            </Link>
                        </Button>
                    </div>

                    <Card className="mb-[20px]">
                        <CardHeader>
                            <CardTitle className="text-center">
                                Crianças
                            </CardTitle>

                            <CardContent className="flex flex-col min-h-[300px] max-h-[300px] overflow-y-scroll p-[10px] gap-[10px]">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Criança 1</CardTitle>
                                        <CardDescription>Júlia Moreira</CardDescription>
                                        <CardDescription>11 anos</CardDescription>
                                        {
                                            true && (

                                                <CardDescription className="font-semibold">Último registro: dd/mm/yyyy</CardDescription>
                                            )
                                        }
                                    </CardHeader>

                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Criança 2</CardTitle>
                                        <CardDescription>Gabriel Montino</CardDescription>
                                        <CardDescription>12 anos</CardDescription>
                                    </CardHeader>

                                </Card>

                            </CardContent>
                        </CardHeader>

                    </Card>

                    <Select defaultValue={""}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Selecione a criança" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id_0">Júlia Moreira </SelectItem>
                            <SelectItem value="id_1">Gabriel Montino</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                <div className='flex absolute inset-x-0 justify-center bottom-[40px]'>
                    <Button className="w-[300px] text-center" type="submit">
                        <Link to="finish">Próximo</Link>
                    </Button>
                </div>

            </div>
        </div>


    )

}