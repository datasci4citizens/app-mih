import CaptureToothPhoto from "./CaptureToothPhoto";
import { ChevronLeft, Play, ArrowRight } from "lucide-react";
import { useFormContext } from "./CreateRegisterForm";
import molarVideo from "@/assets/molarTutorial.mp4";
import { ActionButton } from "@/components/ui/action-button";
import { ToyBackground } from "@/components/ui/toy-background";
import { useState } from "react";

export default function CaptureTwo() {

    const { sendData, next, back } = useFormContext();
    const [showVideo, setShowVideo] = useState(false);
    const [alert, setAlert] = useState(false);

    function handleAlert() {
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 3000);
    }

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative overflow-auto">
            <ToyBackground />

            <div className="relative z-10 min-h-screen flex flex-col pb-10">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <button onClick={back} className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Fotos dos Molares</h1>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl space-y-6">

                            {/* Tutorial Section */}
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-blue-800">Como tirar as fotos?</h3>
                                    <button
                                        onClick={() => setShowVideo(!showVideo)}
                                        className="text-blue-600 text-sm font-semibold flex items-center gap-1"
                                    >
                                        {showVideo ? 'Ocultar' : 'Ver Tutorial'}
                                        <Play size={14} fill="currentColor" />
                                    </button>
                                </div>
                                {showVideo && (
                                    <div className="rounded-xl overflow-hidden shadow-lg mt-2 bg-black">
                                        <video
                                            src={molarVideo}
                                            controls
                                            className="w-full h-48 object-contain"
                                        />
                                    </div>
                                )}
                                {!showVideo && (
                                    <p className="text-sm text-blue-600/80">
                                        Assista o vídeo para ver como fotografar os molares.
                                    </p>
                                )}
                            </div>

                            <p className="text-gray-600 text-center font-medium">
                                Precisamos de uma foto de cada lado
                            </p>

                            {/* Molar Photos - Side by Side */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-700 text-center">Molar Direito</p>
                                    <CaptureToothPhoto photoStep={"2"} />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-700 text-center">Molar Esquerdo</p>
                                    <CaptureToothPhoto photoStep={"3"} />
                                </div>
                            </div>

                            {/* Alert Message */}
                            {alert && (
                                <p className="text-red-500 text-center font-semibold text-sm animate-in fade-in duration-200">
                                    Tire as fotos acima primeiro para prosseguir
                                </p>
                            )}

                            {/* Action Button */}
                            <div className="pt-2">
                                <ActionButton
                                    onClick={() => {
                                        if (sendData.photo2 && sendData.photo3)
                                            next();
                                        else
                                            handleAlert();
                                    }}
                                    icon={ArrowRight}
                                    disabled={!(sendData.photo2 && sendData.photo3)}
                                >
                                    Próxima Etapa
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}