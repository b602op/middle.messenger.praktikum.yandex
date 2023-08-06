import { type TState } from "./";

export const merge = (lhs: TState, rhs: TState): TState => {
    for (const p in rhs) {
        if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
            continue;
        }

        try {
            if (rhs[p].constructor === Object) {
                rhs[p] = merge(lhs[p] as TState, rhs[p] as TState);
            } else {
                lhs[p] = rhs[p];
            }
        } catch (e) {
            lhs[p] = rhs[p];
        }
    }

    return lhs;
};

export const set = (object: TState | unknown, path: string, value: unknown): TState | unknown => {
    if (typeof object !== "object" || object === null) {
        return object;
    }

    if (typeof path !== "string") {
        throw new Error("path must be string");
    }

    const result = path.split(".").reduceRight(
        (acc, key) => ({ [key]: acc }),
        value
    );

    return merge(object as TState, result as TState);
};

export const isTState = (value: unknown): value is TState => (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
);

export const isArray = (value: unknown): value is [] => (
    Array.isArray(value)
);

export const isArrayOrTState = (value: unknown): value is [] | TState => (
    isTState(value) || isArray(value)
);

export const isEqual = (lhs: TState, rhs: TState): boolean => {
    if (Object.keys(lhs).length !== Object.keys(rhs).length) {
        return false;
    }

    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = rhs[key];
        if (isArrayOrTState(value) && isArrayOrTState(rightValue)) {
            if (isEqual(value, rightValue)) {
                continue;
            }
            return false;
        }

        if (value !== rightValue) {
            return false;
        }
    }

    return true;
};
