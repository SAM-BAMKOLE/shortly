export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

export const copyToClipboard = async (
    shortUrl: string,
    id: string,
    setCopiedId: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        await navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL + "/short/" + shortUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

export const slugify = (text: string): string => {
    return text
        .toString()
        .normalize("NFKD") // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const slugInput = (text: string): string => {
    return text
        .toString()
        .normalize("NFKD") // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/^-+/, ""); // Remove leading
        // .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const strToArr = (input: string): string[] => {
    return input
        .split(",")
        .map((val) => val.trim())
        .slice(0, 3);
};
