import { User, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Patient {
    name: string;
    birthday: string;
    patient_id: number;
}

interface PatientSelectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectPatient: (patientId: number) => void;
    patients?: Patient[];
}

function calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function PatientSelectModal({
    open,
    onOpenChange,
    onSelectPatient,
    patients = []
}: PatientSelectModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-2 border-gray-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Selecionar Criança
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Escolha qual criança irá fazer o registro
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {patients.length === 0 ? (
                        // Empty State
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={32} className="text-gray-400" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">
                                Nenhuma criança cadastrada
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Adicione uma criança para começar a fazer registros
                            </p>
                            <Link to="/user/create/patient" onClick={() => onOpenChange(false)}>
                                <button className="bg-[#A0E7E5] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#8EC9BB] transition-colors">
                                    Adicionar Criança
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Patient List */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {patients.map((patient) => {
                                    const age = calculateAge(patient.birthday);

                                    return (
                                        <button
                                            key={patient.patient_id}
                                            onClick={() => {
                                                onSelectPatient(patient.patient_id);
                                                onOpenChange(false);
                                            }}
                                            className="w-full bg-white hover:bg-[#A0E7E5]/10 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#A0E7E5] flex items-center gap-4 transition-all group"
                                        >
                                            {/* Avatar */}
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#A0E7E5] to-[#8EC9BB] p-1 rounded-full shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                                    <User size={28} className="text-[#A0E7E5]" strokeWidth={2.5} />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 text-left">
                                                <h3 className="font-bold text-gray-800 text-lg">
                                                    {patient.name}
                                                </h3>
                                                <p className="text-gray-500 font-medium text-sm">
                                                    {age} anos
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Add New Child Button */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <Link to="/user/create/patient" onClick={() => onOpenChange(false)}>
                                    <button className="w-full bg-gray-50 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-bold border-2 border-dashed border-gray-300 hover:border-[#A0E7E5] hover:text-[#A0E7E5] transition-all">
                                        <Plus size={20} />
                                        <span>Adicionar Nova Criança</span>
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogContent>
        </Dialog>
    );
}
