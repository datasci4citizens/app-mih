import { ChevronLeft, Calendar, Plus, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SkeletonLoading from "../../../lib/components_utils/SkeletonLoading";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { ToyBackground } from "@/components/ui/toy-background";
import { PatientSelectModal } from "@/components/ui/patient-select-modal";
import { useState } from "react";
import { useAllRegisters } from "@/lib/hooks/useAllRegisters";
import { usePatients } from "@/lib/hooks/usePatients";
import { getDiagnosisInfo } from "@/lib/utils/diagnosis";


export default function AllRegisters() {
    const { allRegisters, loading, error, totalRegisters, undiagnosedCount } = useAllRegisters();
    const { patients } = usePatients();
    const [showPatientModal, setShowPatientModal] = useState(false);
    const navigate = useNavigate();

    if (loading) {
        return <SkeletonLoading />;
    }

    if (error) {
        return <ErrorPage type="user"></ErrorPage>;
    }

    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <Link to="/user/home">
                        <button className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors">
                            <ChevronLeft size={28} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Meus Registros</h1>
                        <p className="text-sm text-gray-500 font-medium">Todos os registros</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto space-y-6">

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <p className="text-3xl font-bold text-[#A0E7E5]">{totalRegisters}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Total de Registros</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                    <p className="text-3xl font-bold text-orange-400">{undiagnosedCount}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Não Diagnosticados</p>
                                </div>
                            </div>

                            {allRegisters.length === 0 ? (
                                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                                    <p className="text-gray-500 mb-4">Nenhum registro encontrado</p>
                                    <Link to="/user/registers">
                                        <button className="bg-[#A0E7E5] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#8EC9BB] transition-colors">
                                            Criar Primeiro Registro
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Registers List */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {allRegisters.map((register) => {
                                            const diagnosisInfo = getDiagnosisInfo(register.diagnosis);
                                            const Icon = diagnosisInfo.icon;

                                            return (
                                                <div
                                                    key={register.mih_id}
                                                    onClick={() => navigate(`/user/patients/${register.patient_id}/${register.mih_id}`)}
                                                    className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer"
                                                >
                                                    {/* Icon with badge */}
                                                    <div className={`w-16 h-16 ${diagnosisInfo.bg} rounded-2xl flex items-center justify-center flex-shrink-0 relative`}>
                                                        <Calendar size={28} className={diagnosisInfo.color} />
                                                        {!register.diagnosis && (
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <User size={14} className="text-gray-400 flex-shrink-0" />
                                                            <p className="text-xs text-gray-500 font-medium truncate">{register.patientName}</p>
                                                        </div>
                                                        <h3 className="font-bold text-gray-800 text-base">
                                                            {new Date(register.start_date).toLocaleDateString('pt-BR')}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Icon size={14} className={diagnosisInfo.color} />
                                                            <p className={`text-xs font-bold ${diagnosisInfo.color}`}>
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
                                        <button
                                            onClick={() => setShowPatientModal(true)}
                                            className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-center gap-2 text-gray-600 font-bold border-2 border-dashed border-gray-300 hover:bg-white hover:border-[#A0E7E5] hover:text-[#A0E7E5] transition-all"
                                        >
                                            <Plus size={20} />
                                            <span>Novo Registro</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Selection Modal */}
            <PatientSelectModal
                open={showPatientModal}
                onOpenChange={setShowPatientModal}
                onSelectPatient={(patientId) => {
                    navigate(`/user/registers/create-register/${patientId}/confirm`);
                }}
                patients={patients}
            />
        </div>
    );
}

