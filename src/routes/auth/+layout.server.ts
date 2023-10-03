export const load = async ({cookies}) => {
    const sessionId = cookies.get("session");

    return {
        session: sessionId
    }
}