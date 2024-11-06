import { Button } from "@/components/ui/button";
import CaptureToothPhoto from "./CaptureToothPhoto";
import { ArrowLeft } from "lucide-react";
import { useFormContext } from "./CreateRegisterForm";
import molarVideo from "@/assets/molarTutorial.mp4"
import { Card, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CaptureOne() {

    const { sendData, next, back } = useFormContext();

    const [alert, setAlert] = useState(false)

    function handleAlert() {

        setAlert(true)

        setTimeout(() => {
            setAlert(false)
        }, 3000)

    }

    return (
        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-center pt-[30px] justify-between rounded-t-3xl -mt-16 bg-white space-y-4 mb-10">

                <div className="flex w-[100%] justify-start items-center px-[30px] mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 " onClick={back}>
                        <ArrowLeft color="black" />
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="font-bold text-xl"> Tutorial para a fotografia</h1>
                    <video
                        src={molarVideo}
                        controls
                        className="w-[90%] h-auto mt-4 rounded-lg shadow-lg"
                    />
                </div>

                <Card className="w-[90%] flex flex-col justify-center items-center">
                    <CardTitle className="text-2xl mt-4">Foto do molar direito</CardTitle>
                    <CaptureToothPhoto photoStep={"2"} />
                </Card>

                <Card className="w-[90%] flex flex-col justify-center items-center">
                    <CardTitle className="text-2xl mt-4">Foto do molar esquerdo</CardTitle>
                    <CaptureToothPhoto photoStep={"3"} />
                </Card>

                {
                    alert && (

                        <h1 className="text-destructive"> Tire as fotos acima primeiro para prosseguir </h1>

                    )

                }

                <Button className="text-center my-4" type="submit" onClick={() => {
                    if (sendData.photo2 != "" && sendData.photo3 != "")
                        next();
                    else
                        handleAlert()
                }}>
                    Próxima etapa
                </Button>

            </div>
        </div>

    )


}