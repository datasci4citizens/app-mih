import { ChevronLeft, AlertCircle, Thermometer, FileText, Stethoscope, User as UserIcon } from "lucide-react";
import { useRegistersContext } from "./RegistersControl";
import { ToyBackground } from "@/components/ui/toy-background";
import { MinioImage } from "@/components/ui/minio-image";
import { useState } from "react";

// InfoItem component for displaying questionnaire data
interface InfoItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="p-2 bg-white rounded-lg shadow-sm text-[#A0E7E5]">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm font-bold text-gray-700">{value}</p>
        </div>
    </div>
);

// Get diagnosis styling
const getDiagnosisStyle = (diagnosis: string | null) => {
    switch (diagnosis) {
        case "presence":
            return { label: "Presença de HMI", color: "text-red-500", bg: "bg-red-500", risk: "Alto" };
        case "sugestive":
            return { label: "Sugestivo de HMI", color: "text-yellow-500", bg: "bg-yellow-500", risk: "Médio" };
        case "absence":
            return { label: "Ausência de HMI", color: "text-green-500", bg: "bg-green-500", risk: "Baixo" };
        case "invalid":
            return { label: "Fotos inadequadas", color: "text-gray-500", bg: "bg-gray-500", risk: "Inválido" };
        default:
            return { label: "Aguardando diagnóstico", color: "text-orange-500", bg: "bg-orange-500", risk: "Pendente" };
    }
};

const getPainLevelLabel = (level: number) => {
    switch (level) {
        case 0: return "Sem dor";
        case 1: return "Leve";
        case 2: return "Moderada";
        case 3: return "Intensa";
        default: return "Não informado";
    }
};

export default function Register() {
    const { register, patient, back } = useRegistersContext();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    if (!register || !patient) {
        return null;
    }

    const diagnosisStyle = getDiagnosisStyle(register.diagnosis);
    const painLevel = getPainLevelLabel(register.painLevel);
    const photos = [register.photo_id1, register.photo_id2, register.photo_id3];

    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <button
                        onClick={back}
                        className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Detalhes do Registro</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto space-y-6">

                            {/* Header Card with Patient Info and Diagnosis */}
                            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#A0E7E5] to-[#8EC9BB] rounded-full flex items-center justify-center text-white">
                                            <UserIcon size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                                            <p className="text-sm text-gray-500">
                                                {new Date(register.start_date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    {register.diagnosis && (
                                        <div className={`px-4 py-2 rounded-full bg-opacity-10 ${diagnosisStyle.bg} ${diagnosisStyle.color} font-bold text-sm`}>
                                            Risco {diagnosisStyle.risk}
                                        </div>
                                    )}
                                </div>

                                {register.diagnosis ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <FileText size={18} />
                                                Diagnóstico
                                            </h3>
                                            <p className={`font-bold ${diagnosisStyle.color}`}>{diagnosisStyle.label}</p>
                                        </div>
                                        {register.specialistObservations && (
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <Stethoscope size={18} />
                                                    Observações do Especialista
                                                </h3>
                                                <p className="text-gray-600 text-sm">{register.specialistObservations}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3">
                                        <AlertCircle className="text-orange-500" size={24} />
                                        <div>
                                            <p className="font-bold text-orange-700">Aguardando Diagnóstico</p>
                                            <p className="text-sm text-orange-600">Este registro ainda não foi avaliado por um especialista.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Photos */}
                            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Fotos Registradas</h3>

                                {/* Main Photo Display */}
                                <div className="mb-4 bg-gray-100 rounded-2xl overflow-hidden">
                                    <MinioImage
                                        className="w-full h-64 md:h-96 object-contain"
                                        path={`/${import.meta.env.VITE_MINIO_IMAGES_BUCKET}/${photos[currentPhotoIndex]}.jpg`}
                                    />
                                </div>

                                {/* Photo Thumbnails */}
                                <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto">
                                    {photos.map((photoId, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPhotoIndex(index)}
                                            className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${currentPhotoIndex === index
                                                ? 'border-[#A0E7E5] shadow-lg scale-100 opacity-100'
                                                : 'border-gray-200 hover:border-gray-300 scale-90 opacity-60'
                                                }`}
                                        >
                                            <MinioImage
                                                className="w-full h-full object-cover"
                                                path={`/${import.meta.env.VITE_MINIO_IMAGES_BUCKET}/${photoId}.jpg`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-3 flex justify-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {currentPhotoIndex === 0 && "Foto Frontal"}
                                        {currentPhotoIndex === 1 && "Molar Direito"}
                                        {currentPhotoIndex === 2 && "Molar Esquerdo"}
                                    </span>
                                </div>
                            </div>

                            {/* Questionnaire Answers */}
                            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Respostas do Questionário</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        icon={AlertCircle}
                                        label="Dor de Dente"
                                        value={register.painLevel > 0 ? `Sim (${painLevel})` : "Não"}
                                    />
                                    <InfoItem
                                        icon={Thermometer}
                                        label="Sensibilidade"
                                        value={register.sensitivityField ? "Sim" : "Não"}
                                    />
                                    <InfoItem
                                        icon={AlertCircle}
                                        label="Manchas nos Dentes"
                                        value={register.stain ? "Sim" : "Não"}
                                    />
                                    <InfoItem
                                        icon={UserIcon}
                                        label="Desconforto Estético"
                                        value={register.aestheticDiscomfort ? "Sim" : "Não"}
                                    />
                                </div>

                                {register.userObservations && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Observações do Responsável</p>
                                        <p className="text-gray-700 text-sm">{register.userObservations}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}