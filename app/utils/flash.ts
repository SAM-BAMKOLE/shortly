import { parse, serialize } from "cookie";

export function getFlashMessage(request: Request) {
    const cookie = request.headers.get("Cookie") || "";
    const cookies = parse(cookie);
    const message = cookies.flashMessage;

    return message || null;
}

export function setFlashMessage(message: string) {
    return {
        headers: {
            "Set-Cookie": serialize("flashMessage", message, {
                path: "/",
                httpOnly: true,
                maxAge: 5, // Expires quickly
            }),
        },
    };
}

export function clearFlashMessage() {
    return {
        headers: {
            "Set-Cookie": serialize("flashMessage", "", {
                path: "/",
                httpOnly: true,
                maxAge: 0,
            }),
        },
    };
}
