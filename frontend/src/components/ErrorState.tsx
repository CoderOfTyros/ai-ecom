"use client";

import { useEffect } from "react";

export function ErrorState({
    error,
    reset,
    message = "Something went wrong."
}: {
    error: Error & { digest?: string };
    reset: () => void;
    message?: string;
}) {

    useEffect(() => {
        console.error(error)
    }, [error]);

    return (
        <div>
            <p role="alert">{message}</p>
            <button type="button" onClick={reset}>Try again</button>
        </div>
    )
}
