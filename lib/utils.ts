import { cssExtensions, htmlExtensions, jsExtensions } from './langFactory';
import { FileNamePattern } from './types/CodeMirrorFile';

export function getExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase();
}

export function isCss(fileName: string) {
  return cssExtensions.some((extension) => extension === getExtension(fileName));
}

export function isHtml(fileName: string) {
  return htmlExtensions.some((extension) => extension === getExtension(fileName));
}

export function isJs(fileName: string) {
  return jsExtensions.some((extension) => extension === getExtension(fileName));
}

export function isValidFileNamePattern(name: string): name is FileNamePattern {
  return /.*\..+/.test(name);
}
