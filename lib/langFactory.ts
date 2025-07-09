import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { markdown, markdownKeymap } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Extension, keymap } from '@uiw/react-codemirror';
import { getExtension } from './utils';
import { color } from '@uiw/codemirror-extensions-color';

export const cssExtensions = ['css', 'scss', 'less'] as const;
export const jsExtensions = ['js', 'ts', 'jsx', 'tsx'] as const;
export const xmlExtensions = ['xml', 'rss', 'svg'] as const;
export const htmlExtensions = ['htm', 'html', 'xhtml'] as const;
export const jsonExtensions = ['json'] as const;
export const markdownExtensions = ['md', 'markdown', 'mdown', 'mkd', 'mkdn'] as const;
export const handledExtensions = [
  ...cssExtensions,
  ...jsExtensions,
  ...xmlExtensions,
  ...htmlExtensions,
  ...jsonExtensions,
  ...markdownExtensions
] as const;

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
    case 'rss':
    case 'svg': {
      return [xml({ autoCloseTags: true })];
    }
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
    case 'json': {
      return [json()];
    }
    case 'md':
    case 'markdown':
    case 'mdown':
    case 'mkd':
    case 'mkdn': {
      return [
        markdown({
          addKeymap: true,
          codeLanguages: languages,
          completeHTMLTags: true
        }),
        keymap.of(markdownKeymap)
      ];
    }
    default:
      return null;
  }
};
