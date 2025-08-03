export const parseCSV = <T extends Record<string, unknown>>(
    csv: string,
    converters?: Partial<{ [K in keyof T]: (value: string) => T[K] }>,
): T[] => {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());

    return lines.map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/\r$/, ""));
        const entry = {} as T;

        headers.forEach((h, i) => {
            const rawValue = values[i];
            const key = h as keyof T;
            const convert = converters?.[key];
            (entry[key] as unknown) = convert ? convert(rawValue) : rawValue;
        });

        return entry;
    });
};
