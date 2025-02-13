class Helper {
    static createSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .trim();
    };
    static formatToUSD(text: string): string {
        const value = text.replace(/\D/g, "");
        return value ? parseInt(value).toLocaleString("en-US") : "";
    }
}

export default Helper;