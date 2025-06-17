import { PlaygroundProvider } from '../lib/Contexts/PlaygroundProvider';
import { Title } from './components/Title';
import { Playground } from '../lib';
import { Header } from './components/Header';
import { Hint } from './components/Hint';
import { View } from './components/View';
import { RealExample } from './components/RealExample';

export const App = () => {
  const paneWrapperStyle = {
    outline: '1px solid rgba(25, 25, 25, .5)',
    borderRadius: 4
  };

  return (
    <div>
      <Title>Fullfilling the view</Title>
      <Hint>The playground extend to the bottom of the screen</Hint>
      <PlaygroundProvider>
        <Playground Header={Header} View={View} />
      </PlaygroundProvider>
      <Title>Containerized: height is mandatory, width is optional</Title>
      <Hint>Some style are required when in a flex container</Hint>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10
        }}>
        <PlaygroundProvider>
          <Playground
            height={600}
            wrapperStyle={{ boxSizing: 'border-box', padding: 10 }}
            paneWrapperStyle={paneWrapperStyle}
            Header={Header}
            View={View}
          />
        </PlaygroundProvider>
        <PlaygroundProvider>
          <Playground
            width={400}
            height={`300px`} // Size props also accept string
            wrapperStyle={{ flexShrink: 0, boxSizing: 'border-box', padding: 10 }} // The first Playground has no width set which default to 100%, preventing shrinking here is therefore necessary
            paneWrapperStyle={paneWrapperStyle}
            Header={Header}
            View={View}
          />
        </PlaygroundProvider>
      </div>
      <Title>100% sizes with a sized container</Title>
      <div style={{ width: 500, height: 500 }}>
        <PlaygroundProvider>
          <Playground
            width={'100%'}
            height={`100%`} // Size props also accept string
            wrapperStyle={{ flexShrink: 0, boxSizing: 'border-box', padding: 10 }} // The first Playground has no width set which default to 100%, preventing shrinking here is therefore necessary
            paneWrapperStyle={paneWrapperStyle}
            Header={Header}
            View={View}
          />
        </PlaygroundProvider>
      </div>
      <Title>Real use case example</Title>
      <RealExample />
    </div>
  );
};
