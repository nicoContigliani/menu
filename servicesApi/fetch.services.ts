export const fetchData = async (data: any[] | any, methods: string, url: string) => {
    try {
        const response = await fetch(url, {
            method: methods,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        return {
            ok: response.ok,
            data: result.data || null,
            error: result.error || null,
            message: result.message || null,
        };
    } catch (error: any) {
        console.error("🚀 ~ Error en fetchData:", error);
        return {
            ok: false,
            data: null,
            error: error.message || "Error desconocido",
        };
    }
};
