export function sortArray<T extends { [key: string]: string }>(
    array: T[],
    primaryKey: keyof T,
    secondaryKey: keyof T,
): T[] {
    return array.slice().sort((a, b) => {
        const primaryComparison = a[primaryKey].localeCompare(b[primaryKey]);
        if (primaryComparison !== 0) return primaryComparison;
        return a[secondaryKey].localeCompare(b[secondaryKey]);
    });
}
