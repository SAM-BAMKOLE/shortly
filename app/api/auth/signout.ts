// app/routes/api/signout.tsx
import { type ActionFunction, redirect } from "react-router";
import { clearSessionCookie, getSession } from "~/lib/session";

export const action: ActionFunction = async ({ request }) => {
    try {
        const session = await getSession(request);
        if (!session) return redirect("/");

        return redirect("/auth/signin", { headers: clearSessionCookie() });
    } catch (error) {
        return { error: "Failed to sign out" };
    }
};
