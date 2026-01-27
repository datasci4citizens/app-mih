import { User, Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";
import { ToyBackground } from "@/components/ui/toy-background";
import SkeletonLoading from "@/lib/components_utils/SkeletonLoading";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { usePatients } from "@/lib/hooks/usePatients";
import { calculateAge } from "@/lib/utils/date";




export default function Patients() {
    const navigate = useNavigate();
    const { patients, isLoading, error } = usePatients();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const handleDeleteClick = (patientId: number) => {
        setSelectedPatientId(String(patientId));
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        // TODO: Implement delete API call when endpoint is available
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log("Delete patient:", selectedPatientId);
        }
        setDeleteDialogOpen(false);
        setSelectedPatientId(null);
    };

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
                        <button className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center">
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
                                <button className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-bold border-2 border-dashed border-gray-300 hover:border-[#A0E7E5] hover:bg-white hover:text-[#A0E7E5] transition-all group shadow-sm">
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
                                        <div
                                            key={patient.patient_id}
                                            className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]"
                                        >
                                            {/* Avatar */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#A0E7E5] to-[#8EC9BB] p-1 rounded-full shadow-md flex-shrink-0">
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                                    <User size={32} className="text-[#A0E7E5]" strokeWidth={2.5} />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-xl truncate">{patient.name}</h3>
                                                <p className="text-gray-500 font-medium text-sm">{age} anos</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => navigate(`/user/patients/${patient.patient_id}`)}
                                                    className="p-2 text-gray-400 hover:text-[#A0E7E5] hover:bg-[#A0E7E5]/10 rounded-xl transition-colors"
                                                    title="Ver Registros"
                                                >
                                                    <Calendar size={20} />
                                                </button>
                                                <Link to={`/user/edit/patient/${patient.patient_id}`}>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={20} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(patient.patient_id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Deletar"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Criança</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta criança? Esta ação não pode ser desfeita e todos os registros associados serão perdidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}