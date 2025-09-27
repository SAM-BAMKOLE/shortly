import { redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "~/lib/prisma";
import { createUser, setSessionCookie } from "~/lib/session";

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();
        const { email, password, fullName } = Object.fromEntries(formData) as {
            email: string;
            password: string;
            fullName: string;
        };
        if (!email || !password) return { error: "Email and password required" };

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "Email already exists" };

        const newUser = await createUser(email, password, fullName);
        return redirect("/url/dashboard", { headers: setSessionCookie(newUser.token) });
    } catch (error) {
        console.log(error)
        return { error: "Failed to sign up" };
    }
};
