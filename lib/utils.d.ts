import { RefObject } from 'react';
export declare function findByInclusion(template: string, keywords: string[]): boolean;
/**
 * Get the first keyword found in the string (the keyword with the lowest index) or undefined if none is found
 * @param keywords The list of keywords to search in the string
 * @param text The string to search
 * @returns The keyword found first in the string, or undefined if none is found
 */
export declare function findFirst(keywords: string[], text: string): string | undefined;
/**
 * extract all the substrings between the given opening and ending chars. Given chars are excluded from the substrings returned.
 * It manages nested substring by not ending the substring to extract depending on the number of opening chars found
 * (opening char number must be the same as the ending number for the substring to be returned)
 * @param str The original string to iterate over
 * @param openingChar the char starting the substring
 * @param closingChar the char ending the substring
 * @param matchCondition a function to decide whether or not the substring is returned in the final array. True is not defined
 * @param openingCharCondition a function to decide whether or not the substring, when meeting the opening char, should stop. True if not defined
 * @param closingCharCondition a function to decide whether or not the substring, when meeting the ending char, should stop. True if not defined
 * @returns an Array of substring
 */
export declare function findMatchingPatterns(str: string, openingChar: string, closingChar: string, matchCondition?: (match: string, originalString?: string) => boolean, openingCharCondition?: (currentIndex: number, originalString: string) => boolean, closingCharCondition?: (currentIndex: number, originalString: string) => boolean): string[];
export declare function checkNested(obj: Record<string, any>, path: string): boolean;
/**
 * Unflatten a flat path (eg: "node.subNode") and set a value to it.
 * @param str A string defining the path to create/reach in obj, splitted by a dot (.) (eg: "node.subNode")
 * @param obj The object the node and/or the value will be added to.
 * @param value the value to attribute to the last node/subNode of str (eg: if str = "node.subNode", an empty obj will become : {node:{subNode: [value]}})
 */
export declare const unflattenAndFill: (str: string, obj: any, value: any) => void;
/**
 * Get a value nested in an object depending on a given path
 * Source : https://stackoverflow.com/a/6491621
 * @param object the object to search
 * @param path where the value is (path.to.the[0].value)
 * @returns the Value found with the given path
 */
export declare function getNested(object: any, path: string): any;
export declare const getPaddingValues: (ref?: RefObject<HTMLDivElement>) => {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    padding: number;
} | {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
};
export declare const getBorderValues: (ref?: RefObject<HTMLDivElement>) => {
    borderTop: number;
    borderRight: number;
    borderBottom: number;
    borderLeft: number;
};
