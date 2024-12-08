# React modular Playground

This project provides a customizable playground for a React application.

## Basic use
This version will take the available space between the top of the component to the bottom of the screen
```js
<Playground />
```

The Playground uses @uiw/react-codemirror package as default editor but you can provide your own. See the Editor prop below.

## Local use

You can also use this playground inside a container. The playground will automatically fit the container depending on its size
```js
<div ref={parentRef}>
  <Playground parentRef={parentRef} />
</div>
```

# Customization
You can customize the component with a lot of props to pass to the Playground. Check the repository types folder for the props list.
A header can be provided to handle the fullscreen mode and the switch between the vertical and horizontal layout. You have access to all the playground props in your custom header.
A simple debug mode is available to check the template
*Note: There is no className or style for the wrapper. It makes the calculation way to random for me due to the use of `getComputedStyle` whitch does not provide clear informations about paddings, margin etc. You can still customize it through the className `modular-playground-wrapper` appled to it or by providing a custom wrapperRef to the Playground.*

# Full example

```js
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
        Header={(props) => <CustomHeader {...props} />}
        onBeforeResize={() => console.log('onBeforeResize')} // triggered right before the mousedown event on the handle
        onAfterResize={() => console.log('onAfterResize')} // triggered right before the mousedown event is removed
      />
      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: '16px' }}>
        <div ref={parentRef} style={parentStyle}>
          <Playground
            parentRef={parentRef}
            headerStyle={headerStyle}
            Header={(props) => <CustomHeader {...props} />}
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
```# playground
