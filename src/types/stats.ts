export type Stats = {
    [key: string]: {
        value: number;
        percentile: number;
    };
}

export type StatInfo = {
    count: number;
    pages: number;
    next: number | null;
    prev: number | null;
}