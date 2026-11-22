export const paymentPost = async (session_id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId: session_id,
        }),
    })
    return res;
}