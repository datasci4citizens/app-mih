import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorPage({ type }: { type: string }) {


    return (

        <div className="h-screen min-w-full flex flex-col justify-start items-center p-[30px] pt-[100px] bg-primary">

            <div className="flex flex-col justify-between items-center h-[60%]">
                <h1 className="text-4xl font-bold text-white text-start">Ops! <br /> Parece que algo deu errado... </h1>

                {
                    type === "specialist" &&
                    <Link to="/specialist/home">
                        <Button variant={"secondary"} className="text-2xl text-primary">
                            Retornar
                        </Button>
                    </Link>
                }
                {
                    type === "user" &&
                    <Link to="/user/home">
                        <Button>
                            Retornar
                        </Button>
                    </Link>
                }
                {
                    type === "login" &&
                    <Link to="/login">
                        <Button>
                            Retornar
                        </Button>
                    </Link>
                }
            </div>

        </div>

    )


}