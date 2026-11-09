import type { ReactNode } from "react";

interface LegalSection {
    heading: string;
    body: ReactNode;
}

// Simple text page used by /terms and /privacy
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
    return (
        <main className="mx-auto mt-35 mb-30 max-w-3xl px-6 font-nunito">
            <h1 className="text-center text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-center text-sm text-zinc-500">Last updated: {updated}</p>

            <div className="mt-12 space-y-10">
                {sections.map((section) => (
                    <section key={section.heading}>
                        <h2 className="text-xl font-bold">{section.heading}</h2>
                        <div className="mt-3 space-y-3 leading-relaxed text-zinc-700">{section.body}</div>
                    </section>
                ))}
            </div>
        </main>
    );
}
