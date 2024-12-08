import { RefObject } from 'react';

export function findByInclusion(template: string, keywords: string[]): boolean {
  const lowerTemplate = template.toLowerCase();
  return keywords.some((keyword) => lowerTemplate.includes(keyword.toLowerCase()));
}

/**
 * Get the first keyword found in the string (the keyword with the lowest index) or undefined if none is found
 * @param keywords The list of keywords to search in the string
 * @param text The string to search
 * @returns The keyword found first in the string, or undefined if none is found
 */
export function findFirst(keywords: string[], text: string): string | undefined {
  let firstKeyword: string | undefined;
  let lowestIndex: number = text.length;

  for (const keyword of keywords) {
    const index = text.indexOf(keyword);
    if (index !== -1 && index < lowestIndex) {
      firstKeyword = keyword;
      lowestIndex = index;
    }
  }

  return firstKeyword;
}

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
export function findMatchingPatterns(
  str: string,
  openingChar: string,
  closingChar: string,
  matchCondition?: (match: string, originalString?: string) => boolean,
  openingCharCondition?: (currentIndex: number, originalString: string) => boolean,
  closingCharCondition?: (currentIndex: number, originalString: string) => boolean
): string[] {
  const matches = [];
  const stack = [];
  let currentMatch = '';
  let i = 0;

  for (const char of str) {
    const matchCond = matchCondition ? matchCondition(currentMatch, str) : true;
    const openingCond = openingCharCondition ? openingCharCondition(i, str) : true;
    const closingCond = closingCharCondition ? closingCharCondition(i, str) : true;

    if (char === openingChar && openingCond) {
      if (stack.length > 0) {
        currentMatch += char;
      }
      stack.push(openingChar);
    } else if (char === closingChar && closingCond) {
      if (stack.length > 0) {
        stack.pop();

        if (stack.length === 0) {
          matchCond && matches.push(currentMatch);
          currentMatch = '';
        } else {
          currentMatch += char;
        }
      }
    } else {
      if (stack.length > 0) {
        currentMatch += char;
      }
    }

    i++;
  }

  return matches;
}

export function checkNested(obj: Record<string, any>, path: string): boolean {
  const keys = path.split('.');

  // Base case: If the object directly has the property, return true
  if (keys.length === 1 && keys[0] in obj) {
    return true;
  }

  // Recursive case: Check nested properties
  const [currentKey, ...remainingKeys] = keys;
  if (currentKey in obj && typeof obj[currentKey] === 'object' && obj[currentKey] !== null) {
    return checkNested(obj[currentKey], remainingKeys.join('.'));
  }

  // Property not found
  return false;
}

/**
 * Unflatten a flat path (eg: "node.subNode") and set a value to it.
 * @param str A string defining the path to create/reach in obj, splitted by a dot (.) (eg: "node.subNode")
 * @param obj The object the node and/or the value will be added to.
 * @param value the value to attribute to the last node/subNode of str (eg: if str = "node.subNode", an empty obj will become : {node:{subNode: [value]}})
 */
export const unflattenAndFill = (str: string, obj: any, value: any) => {
  let firstNode = str.substring(0, str.indexOf('.'));
  let strRest = str.indexOf('.') !== -1 ? str.substring(str.indexOf('.') + 1) : undefined;

  if (firstNode.length <= 0) {
    firstNode = str;
  }

  if (!obj) {
    obj = {};
  }

  if (!obj.hasOwnProperty(firstNode)) {
    obj[firstNode] = {};
  }

  if (strRest) {
    unflattenAndFill(strRest, obj[firstNode], value);
  } else {
    obj[firstNode] = value;
  }
};
/**
 * Get a value nested in an object depending on a given path
 * Source : https://stackoverflow.com/a/6491621
 * @param object the object to search
 * @param path where the value is (path.to.the[0].value)
 * @returns the Value found with the given path
 */
export function getNested(object: any, path: string) {
  const pathParams: Array<string> = path.split('.');

  for (let i = 0, n = pathParams.length; i < n; ++i) {
    let k = pathParams[i];
    if (object.hasOwnProperty(k)) {
      object = object[k];
    } else {
      return;
    }
  }

  return object;
}

export const getPaddingValues = (ref?: RefObject<HTMLDivElement>) => {
  if (ref?.current) {
    const computedStyle = window.getComputedStyle(ref.current);

    const padding = {
      paddingTop: parseFloat(computedStyle.paddingTop),
      paddingRight: parseFloat(computedStyle.paddingRight),
      paddingBottom: parseFloat(computedStyle.paddingBottom),
      paddingLeft: parseFloat(computedStyle.paddingLeft),
      padding: parseFloat(computedStyle.padding)
    };

    return padding;
  }

  return { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 };
};

export const getBorderValues = (ref?: RefObject<HTMLDivElement>) => {
  if (ref?.current) {
    const computedStyle = window.getComputedStyle(ref.current);
    const borders = {
      borderTop: parseFloat(computedStyle.borderTop),
      borderRight: parseFloat(computedStyle.borderRight),
      borderBottom: parseFloat(computedStyle.borderBottom),
      borderLeft: parseFloat(computedStyle.borderLeft)
    };

    return borders;
  }

  return { borderTop: 0, borderRight: 0, borderBottom: 0, borderLeft: 0 };
};
