import { useEffect, useRef, useState } from "react";
import { useFormContext } from "./CreateRegisterForm";
import { Camera, RefreshCw, Check } from "lucide-react";

export default function CaptureToothPhoto({ photoStep }: { photoStep: string }) {

    const { sendData, updateFields } = useFormContext();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);


    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            updateFields({ [`photo${photoStep}`]: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const photoKey = `photo${photoStep}` as 'photo1' | 'photo2' | 'photo3';
        const existingPhoto = sendData[photoKey];

        if (existingPhoto && existingPhoto instanceof File && !previewUrl) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(existingPhoto);
        }
    }, [sendData, photoStep, previewUrl]);


    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCapture}
                className="hidden"
                ref={inputRef}
            />

            {/* Large capture area with dashed border */}
            <div
                className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group cursor-pointer"
                onClick={handleButtonClick}
            >
                {previewUrl ? (
                    <>
                        {/* Photo Preview */}
                        <img src={previewUrl} alt="Foto capturada" className="w-full h-full object-cover" />

                        {/* Overlay on hover to retake */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleButtonClick();
                                }}
                                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white/30 transition-all active:scale-95"
                            >
                                <RefreshCw size={18} />
                                Tirar Outra
                            </button>
                        </div>

                        {/* Check badge */}
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md">
                            <Check size={16} strokeWidth={3} />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Empty state - tap to capture */}
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3 group-hover:bg-[#A0E7E5]/10 transition-colors">
                            <Camera size={32} className="text-gray-400 group-hover:text-[#A0E7E5] transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-gray-400 group-hover:text-[#A0E7E5] transition-colors">
                            Toque para Capturar
                        </span>
                    </>
                )}
            </div>
        </div>
    )
}