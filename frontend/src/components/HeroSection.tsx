import Image from "next/image"
export function HeroSection() {
    return (
        <section className="h-screen">
            <Image src="/images/hero2.png" alt="Hero" className="object-cover" fill />
        </section>
    )
}