import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const ActionButton = ({
    children,
    onClick,
    icon: Icon,
    disabled = false,
    className = "",
    type = "button"
}: ActionButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                // Base styles
                "w-full rounded-2xl py-4 px-6 font-bold text-white",
                "flex items-center justify-center gap-3",
                // Gradient background
                "bg-gradient-to-br from-[#FF8A65] to-[#FFB394]",
                // 3D shadow effect
                "shadow-[0_4px_0_rgba(0,0,0,0.1)]",
                // Animations and transitions
                "transform transition-all duration-150",
                "hover:-translate-y-1",
                "active:scale-95 active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1",
                // Disabled state
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "disabled:transform-none disabled:shadow-[0_4px_0_rgba(0,0,0,0.1)]",
                "disabled:hover:translate-y-0",
                className
            )}
        >
            {Icon && <Icon size={24} strokeWidth={2.5} />}
            <span className="text-lg font-semibold">{children}</span>
        </button>
    );
};
