import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";

type PatientData = {

    patient: string

}

type PatientFormProps = PatientData & {
    updateFields: (fields: Partial<PatientData>) => void;
    next: () => void;
}

export default function SelectPatientNew({ patient, updateFields, next }: PatientFormProps) {

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

                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-md"> Selecione uma criança *</h1>
                    <Select defaultValue={patient} name="patient" onValueChange={e => {
                        updateFields({ patient: e })
                    }}>
                        <SelectTrigger className="w-[300px]" >
                            <SelectValue placeholder="Selecione a criança" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id_0">Júlia Moreira </SelectItem>
                            <SelectItem value="id_1">Gabriel Montino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-[300px] text-center mt-[40px]" type="submit" onClick={() => {
                    if (patient !== "")
                        next();
                }}>
                    Próximo
                </Button>


            </div>
        </div >


    )

}