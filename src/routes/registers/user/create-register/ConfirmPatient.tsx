import { ArrowRight, ChevronLeft, Calendar, Users, Thermometer, Baby, Weight, Activity, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormContext } from "./CreateRegisterForm";
import { ActionButton } from "@/components/ui/action-button";
import { ToyBackground } from "@/components/ui/toy-background";

// InfoItem component for displaying patient data
interface InfoItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
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

export default function ConfirmPatient() {

    const { sendData, updateFields, next } = useFormContext();

    const { patient } = { ...sendData };

    if (!patient) return null;

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative">
            <ToyBackground />

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <Link to={`/user/home`}>
                        <button className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors">
                            <ChevronLeft size={28} />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Confirmar Dados</h1>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center px-6 pb-6">
                    <div className="w-full max-w-md md:max-w-4xl">
                        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl space-y-6">

                            {/* Patient Header with Avatar */}
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#A0E7E5] to-[#8EC9BB] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                                    {patient.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                                    <p className="text-gray-500 text-sm">Confirme os dados abaixo</p>
                                </div>
                            </div>

                            {/* Patient Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                <InfoItem
                                    icon={Calendar}
                                    label="Data de Nascimento"
                                    value={new Date(patient.birthday).toLocaleDateString('pt-BR')}
                                />
                                {(patient.brothersNumber || 0) > 0 && (
                                    <InfoItem
                                        icon={Users}
                                        label="Irmãos"
                                        value={patient.brothersNumber}
                                    />
                                )}
                                <InfoItem
                                    icon={Thermometer}
                                    label="Febre/Infecção"
                                    value={patient.highFever ? "Sim" : "Não"}
                                />
                                <InfoItem
                                    icon={Baby}
                                    label="Prematuro"
                                    value={patient.premature ? "Sim" : "Não"}
                                />
                                <InfoItem
                                    icon={Weight}
                                    label="Baixo Peso"
                                    value={patient.lowWeight ? "Sim" : "Não"}
                                />
                                <InfoItem
                                    icon={Activity}
                                    label="Tipo de Parto"
                                    value={patient.deliveryType === "normal" ? "Normal" : "Cesárea"}
                                />
                                {patient.consultType && patient.consultType !== "" && (
                                    <InfoItem
                                        icon={Stethoscope}
                                        label="Atendimento"
                                        value={patient.consultType === "public" ? "Público" : "Particular"}
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 space-y-3 md:flex md:space-y-0 md:gap-4 md:justify-end">
                                <Link to="/user/home" className="w-full md:w-auto md:min-w-[200px]">
                                    <button className="w-full py-3 text-gray-500 font-bold text-sm hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                                        Trocar Criança
                                    </button>
                                </Link>
                                <div className="w-full md:w-auto md:min-w-[250px]">
                                    <ActionButton
                                        onClick={() => {
                                            if (patient?.name === "")
                                                updateFields({ patient: patient });
                                            next();
                                        }}
                                        icon={ArrowRight}
                                    >
                                        Confirmar e Continuar
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}