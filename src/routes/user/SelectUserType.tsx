import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import imgTooth from "@/assets/tooth.png"

export default function SelectUserType() {

    return (

        <div className="flex flex-col min-h-screen items-center justify-center gap-[32px] pt-[100px] pb-[60px] bg-primary">
            <h1 className="font-extrabold text-3xl text-white">MolarCheck</h1>

            <img src={imgTooth}></img>

            <div className="flex flex-col gap-2 w-[40%]">
                <Button className="bg-white hover:bg-white gap-[5px]">
                    <Link to="/user/create/tcle" className="text-black font-semibold">Sou Paciente</Link>
                </Button>
                <Button className="bg-white hover:bg-white gap-[5px]">
                    <Link to="/specialist/create" className="text-black font-semibold">Sou Dentista</Link>
                </Button>
            </div>

        </div>

    )

}