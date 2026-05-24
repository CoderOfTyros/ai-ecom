
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

type HealthResponse = {
    ok: boolean;
    service: string;
    time: string;
};

export default async function Page() {
    let data: HealthResponse | null = null;
    let error: string | null = null;

    try {
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/health`, {
            cache: "no-store"
        });
        if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
        data = (await res.json()) as HealthResponse;
    }
    catch (err: unknown) {
        error = err instanceof Error ? err.message : "Unknown error";
    }

    return (
        <main className="">
            <h1 className="text-5xl">Frontend Phase 1</h1>

            <div>
                <h2 className="text-2xl">Backend Health Response</h2>
                {
                    error ? (<p>Error: {error}</p>) : (
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    )
                }
            </div>
        </main>
    )

}