function compare<T extends string | number>(a: T, b: T): number {
    return typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : Number(b) - Number(a);
}

export function sortArray<T extends { [key: string]: string | number }>(array: T[], ...keys: (keyof T)[]): T[] {
    return array.slice().sort((a, b) => {
        let comparisonScore = 0;
        let keyIndex = 0;

        while (comparisonScore === 0 && keyIndex < keys.length) {
            const key = keys[keyIndex];
            comparisonScore = compare(a[key], b[key]);
            keyIndex += 1;
        }

        return comparisonScore;
    });
}
