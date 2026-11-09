import { Navbar } from "@/components/navbar/Navbar"
import { Footer } from "@/components/Footer"

export default function StoreLayout({ children }: { children: React.ReactNode }) {

    return (
        // flex column + flex-1: on short pages (e.g. empty cart) the content
        // grows to fill the screen, so the footer stays at the bottom
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
