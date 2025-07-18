function compare<T extends string | number>(a: T, b: T): number {
    return typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : Number(b) - Number(a);
}

export function sortArray<T extends { [key: string]: string | number }>(array: T[], ...keys: (keyof T)[]): T[] {
    return array.slice().sort((a, b) => {
        let comparisonScore = 0;
        let keyIndex = 0;

        while (comparisonScore === 0 && keyIndex < keys.length - 1) {
            comparisonScore = compare(a[keys[keyIndex]], b[keys[keyIndex]]);
            keyIndex += 1;
        }

        return comparisonScore;
    });
}
