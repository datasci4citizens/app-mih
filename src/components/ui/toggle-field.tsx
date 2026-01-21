import { cn } from '@/lib/utils';

interface ToggleFieldProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    className?: string;
}

export const ToggleField = ({
    label,
    value,
    onChange,
    className = ""
}: ToggleFieldProps) => {
    return (
        <div
            onClick={() => onChange(!value)}
            className={cn("p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50/50", className)}
        >
            <label className="text-sm font-semibold text-gray-700 cursor-pointer pointer-events-none">{label}</label>
            <div className="flex bg-gray-200 rounded-lg p-1 pointer-events-none">
                <button
                    type="button"
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                        !value
                            ? "bg-white shadow-sm text-gray-800"
                            : "text-gray-500"
                    )}
                >
                    Não
                </button>
                <button
                    type="button"
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                        value
                            ? "bg-[#A0E7E5] shadow-sm text-white"
                            : "text-gray-500"
                    )}
                >
                    Sim
                </button>
            </div>
        </div>
    );
};
