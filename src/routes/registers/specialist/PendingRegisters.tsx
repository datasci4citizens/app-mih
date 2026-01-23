import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSpecialistRegistersContext } from "./SpecialsitRegistersControl";
import useSWR from "swr";
import { ToyBackground } from "@/components/ui/toy-background";

type RegisterData = {
    start_date: string,
    end_date: string,
    painLevel: number,
    sensitivityField: boolean,
    stain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string,
    specialistObservations: string,
    diagnosis: string
    mih_id: number;
}

function RegisterCard({ value, selectRegister }: { value: RegisterData, selectRegister: (id: string) => void }) {
    const { data: mihData, isLoading } = useSWR(`/mih/${value.mih_id}`);

    const patientName = isLoading ? "Carregando..." : mihData?.patient?.name || "Paciente desconhecido";

    return (
        <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-200">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                            <User size={18} className="text-cyan-600" />
                            <span className="truncate max-w-[150px] md:max-w-[200px]">{patientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={16} />
                            {new Date(value.start_date).toLocaleDateString("pt-BR")}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold w-fit ${value.diagnosis ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {value.diagnosis ? 'Avaliado' : 'Aguardando Avaliação'}
                    </div>

                    <Button
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-md h-12 font-semibold text-base transition-colors"
                        onClick={() => selectRegister(String(value.mih_id))}
                    >
                        <Eye className="mr-2 h-5 w-5" />
                        Avaliar Registro
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function PendingRegisters() {

    const { data, selectRegister } = useSpecialistRegistersContext()

    return (
        <div className="w-full bg-[#A0E7E5] min-h-screen relative">
            <ToyBackground />

            <div className="relative z-10 p-6 max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pt-4">
                    <Link to="/specialist/home">
                        <Button size="icon" className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-sm transition-colors">
                            <ArrowLeft size={24} />
                        </Button>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 drop-shadow-sm">Avaliações Pendentes</h1>
                </div>

                {/* List Content */}
                {(!data || data.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="bg-white/30 p-8 rounded-full mb-4">
                            <Calendar size={64} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-teal-900">Tudo em dia!</h2>
                        <p className="text-teal-800">Nenhum registro pendente de avaliação.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {data?.map((value: RegisterData) => (
                            <RegisterCard key={value.mih_id} value={value} selectRegister={selectRegister} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}