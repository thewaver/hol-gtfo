export type ArrayType<T extends readonly unknown[]> = T extends readonly (infer E)[] ? E : never;
