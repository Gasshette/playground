import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { Extension } from '@uiw/react-codemirror';
import { getExtension } from './utils';
import { color } from '@uiw/codemirror-extensions-color';

export const cssExtensions = ['css', 'scss', 'less'] as const;
export const jsExtensions = ['js', 'ts', 'jsx', 'tsx'] as const;
export const htmlExtensions = ['xml', 'htm', 'html', 'xhtml'] as const;
export const handledExtensions = [...cssExtensions, ...jsExtensions, ...htmlExtensions] as const;

export type HandledExtensionsType = (typeof handledExtensions)[number];

export const langFactory = (fileName: string): Array<Extension> | null => {
  const extension = getExtension(fileName) as HandledExtensionsType;

  if (!extension) {
    return null;
  }

  switch (extension) {
    case 'css':
    case 'scss':
    case 'less': {
      return [css(), color];
    }
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx': {
      return [javascript({ typescript: true, jsx: true })];
    }
    case 'xml':
    case 'htm':
    case 'html':
    case 'xhtml': {
      return [
        html({
          selfClosingTags: true,
          autoCloseTags: true,
          matchClosingTags: true
        })
      ];
    }
    default:
      return null;
  }
};
