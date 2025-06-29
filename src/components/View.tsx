import { useEffect, useRef, useState } from 'react';
import { usePlaygroundContext } from '@lib/index';
import { isCss, isHtml, isJs } from '@lib/utils';
import resetCss from '../reset.css?raw';
import { Loader } from './Loader';

export const View = () => {
  const {
    events,
    playgroundState: { files }
  } = usePlaygroundContext();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewId = 'MyView';
  const [srcDoc, setSrcDoc] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const createSrcDoc = async () => {
      setIsDelayed(true);

      const html = files
        .filter((file) => isHtml(file.name))
        .map((file) => `<!-- File: ${file.name} -->\n${file.state?.doc.toString() ?? ''}`)
        .join(`\n\n`);

      const css = files
        .filter((file) => isCss(file.name))
        .map((file) => `/* File: ${file.name} */\n${file.state?.doc.toString() ?? ''}`)
        .join(`\n\n`);

      const js = files
        .filter((file) => isJs(file.name))
        .map((file) => `// File: ${file.name}\n${file.state?.doc.toString() ?? ''}`)
        .join(`\n\n`);

      const fullDocument = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <style>${resetCss}</style>
      <style>${css}</style>
      </head>
      <body>
      <div id="${viewId}">
      ${html}
      </div>
      <script>
      ${js}
      </script>
      </body>
      </html>
      `;

      setSrcDoc(fullDocument);
      timer = setTimeout(() => setIsDelayed(false), 500);
    };

    events.subscribe('Run', createSrcDoc);

    return () => {
      clearInterval(timer);
      events.unsubscribe('Run', createSrcDoc);
    };
  }, [files, viewId, events]);

  if (isDelayed) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
        <Loader />
      </div>
    );
  }

  return (
    <iframe
      key="iframe"
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      srcDoc={srcDoc}
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
};
