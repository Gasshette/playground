import { useRef } from 'react';
import { PlaygroundHeaderProps } from '../lib/types/PlaygroundHeaderProps';
import { Playground } from '../lib/components/playground';

export const App = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const headerStyle = {
    display: 'flex',
    gap: 2,
    paddingBottom: '4px',
    paddingTop: '4px'
  };

  const parentStyle = {
    width: '500px',
    height: '500px',
    padding: '30px',
    flexShrink: 0,
    border: '1px solid black'
  };

  return (
    <div>
      <Playground
        headerStyle={headerStyle}
        Header={(props: PlaygroundHeaderProps) => <CustomHeader {...props} />}
        onBeforeResize={() => console.log('onBeforeResize')} // triggered right before the mousedown event on the handle
        onAfterResize={() => console.log('onAfterResize')} // triggered right before the mousedown event is removed
      />
      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: '16px' }}>
        <div ref={parentRef} style={parentStyle}>
          <Playground
            parentRef={parentRef}
            headerStyle={headerStyle}
            Header={(props: PlaygroundHeaderProps) => <CustomHeader {...props} />}
          />
        </div>
      </div>
    </div>
  );
};

const CustomHeader = (props: PlaygroundHeaderProps) => {
  const { isFullScreen, isVertical, handleFullScreen, setIsVertical } = props;

  const buttonStyle = {
    padding: '8px',
    backgroundColor: 'rgba(220, 40, 0, 0.8)',
    color: '#FFF',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        flexGrow: 1,
        gap: 2
      }}>
      <div style={{ flexGrow: 1 }}></div>
      <button style={buttonStyle} onClick={handleFullScreen}>
        {isFullScreen ? 'Exit fullScreen' : 'Go fullScreen'}
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: 'rgba(0, 100, 220, 0.8)' }}
        onClick={() => setIsVertical(!isVertical)}>
        {isVertical ? 'Horizontal' : 'Vertical'} &#8634;
      </button>
    </div>
  );
};
