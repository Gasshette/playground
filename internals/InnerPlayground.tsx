import { PlaygroundProps } from '../lib/types/PlaygroundProps';
import { usePlaygroundContext } from '../lib/Contexts/PlaygroundProvider';
import { EditorPane } from './EditorPane';
import { Handle } from './Handle';
import { ViewPane } from './ViewPane';

interface InnerPlaygroundProps extends PlaygroundProps {
  paneWrapperHeight: string | number;
}

export const InnerPlayground = (props: InnerPlaygroundProps) => {
  const { paneWrapperHeight, paneWrapperStyle, paneWrapperClassNames } = props;

  const { paneWrapperRef, playgroundState } = usePlaygroundContext();

  return (
    <div
      ref={paneWrapperRef}
      className={`PlaygroundPaneWrapper ${paneWrapperClassNames ?? ''}`.trim()}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: playgroundState.direction,
        height: paneWrapperHeight,
        alignItems: 'stretch',
        ...paneWrapperStyle
      }}>
      <EditorPane {...props} />
      <Handle {...props} />
      <ViewPane {...props} />
    </div>
  );
};
