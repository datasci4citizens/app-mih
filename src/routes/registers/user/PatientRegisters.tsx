import { ChevronLeft, Calendar, AlertCircle, CheckCircle2, Plus, XCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSWR from 'swr';
import SkeletonLoading from "../../../lib/components_utils/SkeletonLoading";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { ToyBackground } from "@/components/ui/toy-background";
// Map diagnosis to risk level with visual styling
const getDiagnosisInfo = (diagnosis: string | null) => {
    switch (diagnosis) {
        case "presence":
            return {
                label: "Presença de HMI",
                risk: "Alto",
                color: "text-red-500",
                bg: "bg-red-50",
                icon: AlertCircle
            };
        case "sugestive":
            return {
                label: "Sugestivo de HMI",
                risk: "Médio",
                color: "text-yellow-500",
                bg: "bg-yellow-50",
                icon: AlertCircle
            };
        case "absence":
            return {
                label: "Ausência de HMI",
                risk: "Baixo",
                color: "text-green-500",
                bg: "bg-green-50",
                icon: CheckCircle2
            };
        case "invalid":
            return {
                label: "Fotos inadequadas",
                risk: "Inválido",
                color: "text-gray-500",
                bg: "bg-gray-50",
                icon: XCircle
            };
        default:
            return {
                label: "Aguardando diagnóstico",
                risk: "Pendente",
                color: "text-orange-500",
                bg: "bg-orange-50",
                icon: AlertCircle
            };
    }
};

export default function PatientRegisters() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const { data: patient, error: patientError, isLoading: patientLoading } = useSWR(`/api/patients/${patientId}`);
    const { data, error, isLoading } = useSWR(`/api/patients/${patientId}/mih`);

    if (isLoading || patientLoading) {
        return <SkeletonLoading />;
    }
    if (error || patientError) {
        return <ErrorPage type="user"></ErrorPage>;
    }

    const registers = Array.isArray(data) ? data : [];
    const undiagnosedCount = registers.filter((r: any) => !r.diagnosis || r.diagnosis === null).length;

    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <button
                        onClick={() => navigate('/user/patients')}
                        className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-all active:scale-95 flex items-center justify-center"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Registros de {patient?.name}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Histórico de avaliações</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto space-y-6">

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <p className="text-3xl font-bold text-[#A0E7E5]">{registers.length}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Avaliações</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <p className="text-3xl font-bold text-orange-400">{undiagnosedCount}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Não Diagnosticados</p>
                                </div>
                            </div>

                            {/* Registers List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {registers.map((record: any) => {
                                    const diagnosisInfo = getDiagnosisInfo(record.diagnosis);
                                    const Icon = diagnosisInfo.icon;

                                    return (
                                        <div
                                            key={record.mih_id}
                                            onClick={() => navigate(`/user/patients/${patientId}/${record.mih_id}`)}
                                            className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                        >
                                            {/* Icon with badge */}
                                            <div className={`w-16 h-16 ${diagnosisInfo.bg} rounded-2xl flex items-center justify-center flex-shrink-0 relative`}>
                                                <Calendar size={28} className={diagnosisInfo.color} />
                                                {!record.diagnosis && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-lg">
                                                    {new Date(record.start_date).toLocaleDateString('pt-BR')}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Icon size={16} className={diagnosisInfo.color} />
                                                    <p className={`text-sm font-bold ${diagnosisInfo.color}`}>
                                                        {diagnosisInfo.risk === "Inválido" || diagnosisInfo.risk === "Pendente"
                                                            ? diagnosisInfo.label
                                                            : `Risco ${diagnosisInfo.risk}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="self-center">
                                                <ChevronLeft size={20} className="text-gray-300 rotate-180" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add New Register Button */}
                            <div className="mt-6">
                                <Link to={`/user/registers/create-register/${patient?.patient_id}/new`}>
                                    <button className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-center gap-2 text-gray-600 font-bold border-2 border-dashed border-gray-300 hover:bg-white hover:border-[#A0E7E5] hover:text-[#A0E7E5] transition-all active:scale-95">
                                        <Plus size={20} />
                                        <span>Novo Registro para {patient?.name}</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}