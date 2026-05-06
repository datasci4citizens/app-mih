import { ChevronLeft, CheckCircle2, User, FileText, Image as ImageIcon } from "lucide-react";
import { useFormContext } from "./CreateRegisterForm";
import { ActionButton } from "@/components/ui/action-button";
import { ToyBackground } from "@/components/ui/toy-background";
import loadingGif from "@/assets/gif loading.gif"

// Summary Item component
interface SummaryItemProps {
    label: string;
    value: string;
}

const SummaryItem = ({ label, value }: SummaryItemProps) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="text-gray-800 font-bold text-sm text-right">{value}</span>
    </div>
);

// Section Header component
interface SectionHeaderProps {
    icon: React.ComponentType<any>;
    title: string;
}

const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => (
    <div className="flex items-center gap-2 mb-3 text-gray-800">
        <Icon size={20} className="text-[#FF8A65]" />
        <h3 className="font-bold text-lg">{title}</h3>
    </div>
);

export default function RegisterSummary() {

    const { sendData, back, submit, submitting } = useFormContext();

    const { patient, toothache, painLevel, sensitivity,
        toothStain, aestheticDiscomfort, userObservations } = { ...sendData }

    if (!patient) return null;

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative overflow-auto">
            <ToyBackground />

            <div className="relative z-10 min-h-screen flex flex-col pb-10">
                {/* Header */}
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <button onClick={back} disabled={submitting} className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center disabled:opacity-50">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Resumo do Registro</h1>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="w-full max-w-md md:max-w-4xl">
                        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl space-y-6">
                            <p className="text-gray-600 text-center mb-2">
                                Confirme as informações antes de enviar.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    {/* Patient Section */}
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <SectionHeader icon={User} title="Criança" />
                                        <SummaryItem label="Nome" value={patient.name} />
                                        <SummaryItem
                                            label="Nascimento"
                                            value={new Date(patient.birthday).toLocaleDateString('pt-BR')}
                                        />
                                    </div>

                                    {/* Photos Section */}
                                    <div>
                                        <SectionHeader icon={ImageIcon} title="Fotos" />
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Frontal Photo */}
                                            <div className="space-y-2">
                                                {sendData.photo1 ? (
                                                    <img
                                                        src={URL.createObjectURL(sendData.photo1)}
                                                        alt="Frontal"
                                                        className="w-full aspect-square object-cover rounded-lg shadow-md border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="text-gray-400" />
                                                    </div>
                                                )}
                                                <p className="text-xs text-center text-gray-600 font-medium">Frontal</p>
                                            </div>

                                            {/* Molar Right Photo */}
                                            <div className="space-y-2">
                                                {sendData.photo2 ? (
                                                    <img
                                                        src={URL.createObjectURL(sendData.photo2)}
                                                        alt="Molar Dir."
                                                        className="w-full aspect-square object-cover rounded-lg shadow-md border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="text-gray-400" />
                                                    </div>
                                                )}
                                                <p className="text-xs text-center text-gray-600 font-medium">Molar Dir.</p>
                                            </div>

                                            {/* Molar Left Photo */}
                                            <div className="space-y-2">
                                                {sendData.photo3 ? (
                                                    <img
                                                        src={URL.createObjectURL(sendData.photo3)}
                                                        alt="Molar Esq."
                                                        className="w-full aspect-square object-cover rounded-lg shadow-md border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="text-gray-400" />
                                                    </div>
                                                )}
                                                <p className="text-xs text-center text-gray-600 font-medium">Molar Esq.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex flex-col justify-between">
                                    {/* Questionnaire Section */}
                                    <div className="bg-gray-50 p-4 rounded-2xl h-full">
                                        <SectionHeader icon={FileText} title="Respostas" />
                                        <SummaryItem label="Dor de dente" value={toothache ? "Sim" : "Não"} />
                                        {toothache && (
                                            <SummaryItem
                                                label="Nível da dor"
                                                value={
                                                    painLevel === 1 ? "Leve" :
                                                        painLevel === 2 ? "Moderada" : "Intensa"
                                                }
                                            />
                                        )}
                                        <SummaryItem label="Sensibilidade" value={sensitivity ? "Sim" : "Não"} />
                                        <SummaryItem label="Mancha" value={toothStain ? "Sim" : "Não"} />
                                        {toothStain && (
                                            <SummaryItem label="Desconforto Estético" value={aestheticDiscomfort ? "Sim" : "Não"} />
                                        )}
                                        {userObservations && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <span className="text-gray-500 text-sm font-medium block mb-1">Observações</span>
                                                <p className="text-gray-800 text-sm bg-white p-3 rounded-lg border border-gray-100 italic">
                                                    "{userObservations}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <ActionButton
                                            onClick={submit}
                                            icon={submitting ? undefined : CheckCircle2}
                                            disabled={submitting}
                                        >
                                            {submitting && (
                                                <>
                                                    <img src={loadingGif} className="h-6" alt="Loading" />
                                                    Enviando...
                                                </>
                                            )}
                                            {!submitting && "Enviar Registro"}
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}