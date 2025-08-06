// app/routes/api/signin.tsx
import {
    type ActionFunction,
    type ActionFunctionArgs,
    type LoaderFunction,
    type LoaderFunctionArgs,
    redirect,
} from "react-router";
import { authenticateUser, getSession, setSessionCookie } from "~/lib/session";
import { prisma } from "~/lib/prisma";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request);
    return { user: session };
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    try {
        // const { email, password } = await request.json();
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) return { error: "Email and password required" };

        const session = await authenticateUser(email, password);
        if (!session) return { error: "Invalid email or password" };

        return redirect("/url/dashboard", { headers: setSessionCookie(session.token) });
    } catch (error) {
        return { error: "Failed to sign in" };
    }
};
