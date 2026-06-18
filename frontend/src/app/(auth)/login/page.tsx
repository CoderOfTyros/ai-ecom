"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types";
import Image from "next/image";


export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refresh } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);


    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setSubmitting(true);

        try {
            await api<{ ok: true; user: User }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            await refresh();

            const from = searchParams.get("from");
            router.replace(from || "/");
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.fields) {
                    setFieldErrors(err.fields);
                } else {
                    setError(err.message);
                }
            }
            else {
                setError("Something went wrong");
            }
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="flex w-full min-h-screen">

            {error && (
                <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}
            <aside className="w-1/2 relative">
                <Image src="/images/register.png" alt="register" fill className="object-cover object-right" />
            </aside>

            <main className="w-1/2 h-dvh flex flex-col items-center">

                <div className="h-1/4 mb-8">
                    <h1 className="text-5xl text-bold mt-28 mb-2">Welcome</h1>
                    <p className="ml-10 text-gray-500">Login with Email</p>
                </div>

                <div className="h-1/3 w-full">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center items-center gap-y-8">
                        <div className="text-xl w-1/2">
                            {/* <label htmlFor="email">Email</label> */}
                            <input type="email" id="email" placeholder="Email" className="rounded-lg border-3 border-emerald-800 w-full px-3 py-1.5" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div className="text-xl w-1/2">
                            {/* <label htmlFor="password">Password</label> */}
                            <input type="password" id="password" placeholder="Password" className="rounded-lg border-3 border-emerald-800 w-full px-3 py-1.5" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        <button className="cursor-pointer mt-4 bg-emerald-900 text-white font-bold px-5 py-2 rounded-2xl" type="submit" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
                    </form>
                </div>

                <div>
                    <p className="">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold">Register</Link>
                    </p>
                </div>
            </main>
        </div>
    )

}