import { css } from '@codemirror/lang-css';
import { Compartment, EditorView, Extension, basicSetup } from '@uiw/react-codemirror';
import { useEffect, useState } from 'react';
import { Playground } from '../../lib';
import { PlaygroundProvider } from '../../lib/Contexts/PlaygroundProvider';
import { Header } from './Header';
import { View } from './View';

export const RealExample = () => {
  const compartment = new Compartment();
  // Setup update listener to track content changes
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      const newCode = update.state.doc.toString();
      injectCss(newCode);
    }
  });

  const [extensions, _setExtensions] = useState<Array<Extension>>([
    basicSetup(),
    css(),
    compartment.of(updateListener)
  ]);
  const viewId = crypto.randomUUID().replace(/\d+|-/g, '');
  const defaultValue = `#${viewId} {\n  background-color: darkred;\n  color: #DDD;\n}`;
  /**
   * Injects raw CSS into the DOM by creating (or updating) a <style> tag.
   *
   * @param css - The CSS string to inject
   * @param styleId - Optional ID for the <style> tag to prevent duplicates
   */
  const injectCss = (css: string): void => {
    let styleEl: HTMLStyleElement | null = null;
    const styleId = `style#${viewId}`;
    styleEl = document.getElementById(styleId) as HTMLStyleElement;

    // If no existing element, create a new <style> element
    if (!styleEl) {
      styleEl = document.createElement('style');
      if (viewId) {
        styleEl.id = viewId;
      }
      document.head.appendChild(styleEl);
    }

    // Set or update the CSS content
    styleEl.textContent = css;
  };

  useEffect(() => {
    injectCss(defaultValue);
  }, []);

  return (
    <PlaygroundProvider>
      <Playground
        width={800}
        height={800}
        wrapperStyle={{ boxSizing: 'border-box', padding: 10 }}
        codeMirrorProps={{
          value: defaultValue,
          extensions: extensions
        }}
        Header={Header}
        View={() => {
          return (
            <div id={viewId} style={{ height: '100%' }}>
              <View />
            </div>
          );
        }}
      />
    </PlaygroundProvider>
  );
};
