import type { LucideIcon } from "lucide-react";

interface AboutFeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function AboutFeatureCard({ title, description, icon: Icon}: AboutFeatureCardProps) {
    return (
        <div className={`text-center px-6`}>
            <div>
                <Icon className="h-8 w-8 mx-auto text-emerald-700" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-zinc-950">{title}</h3>
            <p className="text-zinc-600 max-w-52 mx-auto">{description}</p>
        </div>
    );
}