
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, BookPlusIcon, FileQuestion, HeartHandshake, HeartPulse, Hospital, Info, User2Icon } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";



export default function HmiInformations() {

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)


    const carouselItems = [
        <Info />,
        <HeartPulse />,
        <Hospital />,
        <HeartHandshake />,
        <BookPlusIcon />,
        <FileQuestion />
    ]

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])


    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <Card className="flex flex-col border-none shadow-none items-center p-[30px] justify-start rounded-t-3xl -mt-16 bg-white">

                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home">
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <CardHeader className="w-full mb-5 text-3xl font-semi-bold text-center">Informações sobre <b>HMI</b></CardHeader>

                <div className="mb-2 flex gap-2 text-center text-sm text-muted-foreground max-w-[80%]">
                    {


                        Array.from({ length: count }).map((_, index) => {

                            return <Button
                                key={index}
                                size={"icon"}
                                className={`rounded-3xl transition-colors duration-100 ${index <= current ? 'bg-primary hover:bg-primary text-white' : 'bg-primary/20 hover:bg-primary/20 text-primary'
                                    } delay-200`}
                                onClick={() => api?.scrollTo(index)}
                            >
                                <h1>{carouselItems[index]}</h1>



                            </Button>

                        })

                    }
                </div>
                <Carousel setApi={setApi} className="w-[80%]">

                    <CarouselContent className="">
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md"><div className="flex justify-between">O que é HMI? <Info></Info></div></CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    Hipomineralização Molar-Incisivo (HMI) é uma condição que afeta o esmalte dos dentes das crianças, principalmente os primeiros molares permanentes e, às vezes, também os incisivos (os dentes da frente). O esmalte, que é a camada protetora dos dentes, não se desenvolve corretamente por causa de um problema no organismo da criança enquanto os dentes estão se formando.
                                </CardContent>


                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md"> <div className="flex justify-between items-center"><h1 className="text-center">Sintomas dos dentes com HMI</h1> <HeartPulse className="w-[60px]" /></div></CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    Os dentes com HMI podem ter manchas brancas, amareladas ou marrons, podem ser mais sensíveis ao frio, calor ou doces, e podem se desgastar ou quebrar mais facilmente.
                                </CardContent>


                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md">
                                    <div className="flex justify-between items-center"><h1 className="text-center">Tratamentos por severidade</h1> <Hospital className="w-[40px]" /></div>
                                </CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    O tratamento da HMI varia de acordo com a severidade.
                                    <br />
                                    <br />
                                    <b>Em casos leves</b>, onde o esmalte está um pouco mais fraco, mas ainda é possível cuidar sem grandes intervenções, o tratamento costuma incluir cuidados preventivos como: orientação de higiene bucal, acompanhamento e aplicação de flúor ou selantes dentários.
                                    <br />
                                    <br />
                                    <b>Em casos moderados</b>, o esmalte dos dentes está mais comprometido, podendo causar dor e sensibilidade. Nestes casos, os tratamentos podem incluir: restaurações dentárias para proteger as áreas afetadas e tratamento para sensibilidade com produtos específicos para reduzir a dor causada pela sensibilidade dos dentes.
                                    <br />
                                    <br />
                                    <b>Nos casos mais graves</b>, o esmalte está muito danificado, e os dentes podem ficar quebradiços, muito sensíveis ou até com cáries frequentes. O tratamento pode ser mais complexo e incluir até mesmo o uso de coroas ou extrações dentárias (perda do dente).

                                </CardContent>


                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md"><div className="flex justify-between items-center"><h1>Cuidados</h1> <HeartHandshake /></div> </CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    <li className="list-decimal"><b>Visitas regulares ao dentista:</b><br /> Independentemente da gravidade, é importante que a criança seja acompanhada de perto por um dentista, para que os dentes afetados sejam monitorados e tratados adequadamente ao longo do tempo.</li>
                                    <br />
                                    <li className="list-decimal"><b>Cuidado com a sensibilidade:</b><br /> Use produtos para dentes sensíveis e evite alimentos muito quentes, gelados ou doces.</li>
                                    <br />
                                    <li className="list-decimal"><b>Evitar alimentos ácidos:</b><br /> Alimentos como refrigerantes e sucos cítricos podem desgastar ainda mais o esmalte fragilizado.</li>
                                </CardContent>


                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md"><div className="flex justify-between items-center"><h1 className="text-center">Dicas para lidar com o HMI</h1> <BookPlusIcon className="w-[60px]" /></div> </CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    <li className="list-decimal"><b>Use creme dental com flúor:</b><br /> Fortalece o esmalte e ajuda a prevenir cáries.</li>
                                    <br />
                                    <li className="list-decimal"><b>Escove suavemente:</b><br /> Use uma escova macia e ensine a criança a escovar com cuidado, especialmente nas áreas sensíveis.</li>
                                    <br />
                                    <li className="list-decimal"><b>Visite o dentista regularmente:</b><br /> Consultas frequentes ajudam a monitorar a condição e prevenir problemas maiores.</li>
                                    <br />
                                    <li className="list-decimal"><b>Alimentos não muito duros ou pegajosos:</b><br /> Evite que a criança morda alimentos duros, como gelo ou balas, que podem quebrar os dentes frágeis.</li>
                                    <br />
                                    <li className="list-decimal"><b>Hidrate a boca:</b><br /> Se a criança estiver com a boca seca, ofereça bastante água para evitar acúmulo de placa.</li>
                                </CardContent>


                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="shadow-md">
                                <CardHeader className="font-bold text-xl bg-primary text-white mb-4 rounded-t-md"><div className="flex justify-between items-center"><h1 className="text-center">Perguntas frequentes</h1> <FileQuestion className="w-[60px]" /></div> </CardHeader>
                                <CardContent className="min-h-[400px] max-h-[400px] overflow-auto">
                                    <li className="list-decimal"><b>Por que meu filho desenvolveu HMI?</b><br />
                                        A causa exata ainda não é totalmente conhecida, mas acredita-se que seja resultado de fatores sistêmicos, como doenças ou medicamentos durante a gestação ou nos primeiros anos de vida, que afetam o desenvolvimento do esmalte dos dentes.</li>
                                    <br />
                                    <li className="list-decimal"><b>A HMI pode causar cáries?</b><br />
                                        Sim, os dentes afetados por HMI têm um esmalte mais frágil, o que os torna mais propensos a desenvolver cáries, especialmente se não forem tratados adequadamente.</li>
                                    <br />
                                    <li className="list-decimal"><b>Como é feito o diagnóstico de HMI?</b><br />
                                        O diagnóstico é feito pelo dentista ao examinar os dentes da criança. Ele identifica as áreas afetadas e avalia a gravidade da hipomineralização.</li>
                                    <br />
                                    <li className="list-decimal"><b>Meu filho vai sentir dor por causa da HMI?</b><br />
                                        Dentes com HMI podem ser mais sensíveis a alimentos quentes, frios ou doces. Em casos mais graves, essa sensibilidade pode ser intensa, causando dor.</li>
                                    <br />
                                    <li className="list-decimal"><b>A HMI tem cura?</b><br />
                                        A HMI não tem cura, pois os danos no esmalte são permanentes. No entanto, é possível controlar os sintomas e proteger os dentes afetados com os tratamentos adequados.</li>
                                    <br />
                                    <li className="list-decimal"><b>O que posso fazer para prevenir a HMI?</b><br />
                                        Infelizmente, não há como prevenir a HMI, já que ela ocorre durante o desenvolvimento dos dentes. No entanto, manter uma boa higiene bucal e visitar o dentista regularmente pode ajudar a proteger os dentes afetados.</li>
                                    <br />
                                    <li className="list-decimal"><b>Meu filho pode ter uma vida normal com HMI?</b> <br />
                                        Sim! Com o acompanhamento regular do dentista e os cuidados corretos, é possível gerenciar a HMI e garantir que seu filho tenha dentes saudáveis e bem cuidados.</li>

                                </CardContent>


                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

            </Card >

        </div >


    )

}