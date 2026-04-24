import { User, Plus, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ToyBackground } from "@/components/ui/toy-background";
import SkeletonLoading from "@/components/SkeletonLoading";
import ErrorPage from "@/components/ErrorPage";
import { usePatients } from "@/hooks/usePatients";
import { calculateAge } from "@/lib/utils/date";




export default function Patients() {
    const navigate = useNavigate();
    const { patients, isLoading, error } = usePatients();



    if (isLoading) {
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
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <Link to="/user/home">
                        <button className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-all active:scale-95 flex items-center justify-center">
                            <ChevronLeft size={24} />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Gerenciar Crianças</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto space-y-4">

                            {/* Add New Child Button */}
                            <Link to="/user/create/patient">
                                <button className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-bold border-2 border-dashed border-gray-300 hover:border-[#A0E7E5] hover:bg-white hover:text-[#A0E7E5] transition-all active:scale-95 group shadow-sm">
                                    <div className="bg-gray-100 p-2 rounded-full group-hover:bg-[#A0E7E5]/10 transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-lg">Adicionar Nova Criança</span>
                                </button>
                            </Link>

                            {/* Children Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {patients?.map((patient: any) => {
                                    const age = calculateAge(patient.birthday);

                                    return (
                                        <button
                                            key={patient.patient_id}
                                            onClick={() => navigate(`/user/patients/${patient.patient_id}`)}
                                            className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02] active:scale-95 w-full"
                                        >
                                            {/* Avatar */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#A0E7E5] to-[#8EC9BB] p-1 rounded-full shadow-md flex-shrink-0">
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                                    <User size={32} className="text-[#A0E7E5]" strokeWidth={2.5} />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 text-left">
                                                <h3 className="font-bold text-gray-800 text-xl truncate">{patient.name}</h3>
                                                <p className="text-gray-500 font-medium text-sm">{age} anos</p>
                                            </div>

                                            {/* Arrow */}
                                            <div className="self-center">
                                                <ChevronLeft size={20} className="text-gray-300 rotate-180" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}