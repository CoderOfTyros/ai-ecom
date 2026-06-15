import localFont from 'next/font/local';
import { Nunito } from 'next/font/google';

export const cardot = localFont({
    src: [
        {
            path: "../fonts/Cardot-lxq6q.ttf",
            weight: "400",
            style: "normal"

        },
        {
            path: "../fonts/CardotSemibold-1jzKM.ttf",
            weight: "700",
            style: "normal"
        }
    ],
    variable: "--font-cardot-family",

});


export const azonix = localFont({
    src: [
        {
            path: "../fonts/Azonix-1VB0.otf",
            weight: "400",
            style: "normal"

        },
    ],
    variable: "--font-azonix-family",
})

export const nunito = Nunito({
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-nunito-family"
})