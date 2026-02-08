const getBaseUrl = (): string => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return baseUrl;
}

export default getBaseUrl;