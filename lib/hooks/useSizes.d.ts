import { RefObject } from 'react';
export declare const HANDLE_FIRST_DIV_SIZE_KEY = "handle_first_div_size";
export declare const HANDLE_SECOND_DIV_SIZE_KEY = "handle_second_div_size";
export declare const resetSizes: () => void;
export interface Sizes {
    firstDivSize: DOMRect | null;
    secondDivSize: DOMRect | null;
}
export declare const useSizes: (firstDivRef: RefObject<HTMLDivElement>, secondDivRef: RefObject<HTMLDivElement>) => {
    getSizes: () => Sizes;
    saveSizes: () => void;
};
