function compare<T extends string | number>(a: T, b: T): number {
    return typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : Number(b) - Number(a);
}

export function sortArray<T extends { [key: string]: string | number }>(
    array: T[],
    primaryKey: keyof T,
    secondaryKey?: keyof T,
): T[] {
    return array.slice().sort((a, b) => {
        const primaryComparison = compare(a[primaryKey], b[primaryKey]);
        if (primaryComparison !== 0) return primaryComparison;
        if (secondaryKey) return compare(a[secondaryKey], b[secondaryKey]);
        return 0;
    });
}
