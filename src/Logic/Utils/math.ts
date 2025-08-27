export function* generateAllSubsets(size: number, subSize: number): Generator<number[]> {
    let indices = Array.from({ length: subSize }, (_, i) => i + 1);

    while (true) {
        yield [...indices];

        let i = subSize - 1;
        while (i >= 0 && indices[i] === size - subSize + i + 1) i--;
        if (i < 0) break;

        indices[i]++;
        for (let j = i + 1; j < subSize; j++) {
            indices[j] = indices[j - 1] + 1;
        }
    }
}

export function binomial(n: number, k: number): number {
    if (k < 0 || k > n) return 0;

    k = Math.min(k, n - k);

    let result = 1;

    for (let i = 1; i <= k; i++) {
        result *= n - (k - i);
        result /= i;
    }

    return result;
}
