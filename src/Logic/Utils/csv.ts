export const parseCSV = (csv: string) => {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());

    return lines.map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/\r$/, ""));
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
};
