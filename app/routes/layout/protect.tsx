import { AuthProvider } from "~/providers/AuthProvider";
import { getSession } from "~/lib/session";
import type { Route } from "../+types/home";
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export const loader = async ({ request }: { request: Request }) => {
    const session = await getSession(request);
    return { user: session };
};

export default function EnsureAuth({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        // @ts-ignore
        if (!loaderData?.user) {
            console.log(loaderData);
            navigate("/auth/signin");
        } else {
            setIsAuth(true);
        }
    }, []);

    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="aurora-bg"></div>
            </div>
        );
    }

    return (
        <AuthProvider>
            {<Outlet />}
            <ToastContainer />
        </AuthProvider>
    );
}
