import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "./CreateRegisterForm";
import { Camera } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CaptureToothPhoto({ photoStep }: { photoStep: string }) {

    const { sendData, updateFields } = useFormContext();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [photo, setPhoto] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);


    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setPhoto(file);
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
            setPhoto(existingPhoto);
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

        <Card className="flex flex-col justify-center items-center w-[90%] p-2 border-none shadow-none  ">

            <CardHeader>

                <Input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCapture}
                    className="hidden"
                    ref={inputRef}
                />
                <Button onClick={handleButtonClick} className="gap-2">
                    {photo ? "Tirar outra foto" : "Tirar foto"} <Camera />
                </Button>

            </CardHeader>

            {
                previewUrl &&
                <Accordion type="single" collapsible className="w-full flex flex-col justify-center">

                    <AccordionItem value="captureItem">
                        <AccordionTrigger className="font-bold text-primary text-base">
                            Prévia da foto
                        </AccordionTrigger>

                        <AccordionContent className="flex flex-col items-center justify-center">
                            <img src={previewUrl} alt="Captura da foto" className="w-[95%] h-auto rounded-lg shadow-lg" />

                        </AccordionContent>

                    </AccordionItem>

                </Accordion>
            }


        </Card>

    )

}