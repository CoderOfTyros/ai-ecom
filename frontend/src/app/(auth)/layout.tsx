"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// Sends a signed-in user away from /login and /register:
// back to the "from" page (e.g. /checkout), or to "/".
function RedirectWhenSignedIn() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && user) {
            const from = searchParams.get("from");
            // only our own pages: "/x" is ok, "//other-site.com" is not
            const safe = from && from.startsWith("/") && !from.startsWith("//");
            router.replace(safe ? from : "/");
        }
    }, [user, loading, router, searchParams]);

    return null;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    return (
        <>
            {/* useSearchParams() must be inside <Suspense>, or `next build` fails */}
            <Suspense fallback={null}>
                <RedirectWhenSignedIn />
            </Suspense>

            {loading || user ? (
                <div className="flex justify-center py-20">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                </div>
            ) : (
                <div>{children}</div>
            )}
        </>
    );
}
