import { Navbar } from "@/components/Navbar"

export default function StoreLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>

    )
}