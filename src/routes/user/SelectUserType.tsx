import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import imgTooth from "@/assets/Icon.svg"

export default function SelectUserType() {

    return (

        <div className="flex flex-col min-h-screen items-center justify-center gap-[32px] pt-[100px] pb-[60px] bg-primary">
            <h1 className="font-extrabold text-3xl text-white">MolarCheck</h1>

            <img src={imgTooth}></img>

            <div className="flex flex-col gap-2 w-[40%]">
                <Link to="/user/create/tcle" className="w-full">
                    <Button className="bg-white hover:bg-white gap-[5px] text-black font-semibold w-full">
                        Sou Paciente
                    </Button>
                </Link>
                <Link to="/specialist/create" className="w-full">
                    <Button className="bg-white hover:bg-white gap-[5px] text-black font-semibold w-full">
                        Sou Dentista
                    </Button>
                </Link>
            </div>

        </div>

    )

}