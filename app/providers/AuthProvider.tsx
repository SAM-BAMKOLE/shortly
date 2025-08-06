// app/components/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: { userId: number; email: string; token: string } | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ userId: number; email: string; token: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     fetch("/api/signin", { method: "GET" })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setUser(data.user);
    //             setLoading(false);
    //         })
    //         .catch(() => {setLoading(false), console.log('Unable to fetch user')});
    // }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
