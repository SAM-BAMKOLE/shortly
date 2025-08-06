// app/lib/session.ts
import { parse, serialize } from "cookie";
import { nanoid } from "nanoid";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

// Create or retrieve a session
export async function getSession(
    request: Request
): Promise<{ userId: string; email: string; token: string } | null> {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const token = cookies["session"];

    if (!token) return null;

    const user = await prisma.user.findFirst({ where: { token } });
    if (!user) return null;

    return { userId: user.id, email: user.email, token };
}

// Authenticate user with email and password
export async function authenticateUser(
    email: string,
    password: string
): Promise<{ userId: string; email: string; token: string } | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // Generate new session token
    const token = nanoid(32);
    await prisma.user.update({
        where: { id: user.id },
        data: { token },
    });

    return { userId: user.id, email: user.email, token };
}

// Create a new user
export async function createUser(
    email: string,
    password: string,
    fullName: string
): Promise<{ userId: string; email: string; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = nanoid(32);
    const user = await prisma.user.create({
        data: {
            email,
            fullName,
            password: hashedPassword,
            token,
        },
        select: { id: true, email: true, token: true },
    });
    return { userId: user.id, email: user.email, token };
}

// Set session cookie
export function setSessionCookie(token: string): HeadersInit {
    return {
        "Set-Cookie": serialize("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 24 * 60 * 60, // 7 days
            path: "/",
        }),
    };
}

// Clear session cookie
export function clearSessionCookie(): HeadersInit {
    return {
        "Set-Cookie": serialize("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/",
        }),
    };
}
