import { PlaygroundProvider } from '@lib/index';
import { Hint } from './components/Hint';
import { Title } from './components/Title';
import { PlaygroundImpl } from './components/PlaygroundImpl';
import { UserFile } from '@lib/types/UserFile';
import { FileBarThemes } from '@lib/types/FileBarThemes';
import './reset.css';

const theme: FileBarThemes = {
  dark: {
    colors: {
      background: 'chocolate',
      color: 'black',
      danger: 'darkred',
      hover: 'sandybrown',
      indicator: 'sandybrown'
    }
  },
  light: {
    colors: {
      background: 'mistyrose',
      color: 'purple',
      danger: 'purple',
      hover: 'lavenderblush',
      indicator: 'purple'
    }
  }
};

const defaultFiles: Array<UserFile> = [
  {
    name: 'demo.html',
    content: `<h1>Demo</h1>
<p>This playground is so awesome ! &#10084;</p>
<img src="https://picsum.photos/200" alt="picsum random image" />`
  },
  {
    name: 'demo.css',
    content: `body {
  background: mistyrose;
}

#MyView {
  color: purple;
  padding: 16px;
}`
  }
];

export const App = () => {
  return (
    <div>
      <Title>Fullfilling the view</Title>
      <Hint>The playground extend to the bottom of the screen</Hint>
      <Hint>Vertical paddings and margin aren't taken into account and will impact the layout</Hint>
      <PlaygroundProvider defaultFiles={defaultFiles}>
        <PlaygroundImpl />
      </PlaygroundProvider>
      <Title>Containerized: height is mandatory, width is optional</Title>
      <Hint>Some style might be required if the playground is used in a flex container</Hint>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <PlaygroundProvider defaultFiles={defaultFiles}>
          <PlaygroundImpl height={600} />
        </PlaygroundProvider>
        <PlaygroundProvider defaultFiles={defaultFiles}>
          <PlaygroundImpl
            width={400}
            height={`300px`} // Size props also accept string
            wrapperStyle={{ flexShrink: 0 }} // The first Playground has no width set which default to 100%, preventing shrinking here is therefore necessary
          />
        </PlaygroundProvider>
      </div>
      <Title>100% sizes with a sized container</Title>
      <div style={{ width: 500, height: 500 }}>
        <PlaygroundProvider defaultFiles={defaultFiles}>
          <PlaygroundImpl height={`100%`} />
        </PlaygroundProvider>
      </div>
      <Title>Multi file + style customization</Title>
      <Hint>
        You can customize the filebar style to your heart content to match your own theme. You can
        provide themes (light and dark) through the codeMirrorThemes provider property
      </Hint>
      <PlaygroundProvider fileBarThemes={theme} defaultFiles={defaultFiles}>
        <PlaygroundImpl multiFile height={800} />
      </PlaygroundProvider>
    </div>
  );
};
