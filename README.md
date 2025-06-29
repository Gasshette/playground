# React modular Playground

This project provides a customizable playground for a React application.

## Basic use
The simpliest version will extends to the bottom of the screen:
```js
<PlaygroundProvider defaultFiles={defaultFiles}>
  <Playground View={View} defaultFiles={defaultFiles} />
</PlaygroundProvider>
```
defaultFiles are the default files you want to see in the file bar: 
```jsx
const defaultFiles: Array<UserFile> = [{name: "demo.html", content:"<h1>My Tile</h1>\n<p>My content</p>"}]
```
The provider is mandatory, it gives you acces to all the provider states and refs.
You have to provide the View component: you decide what to do with the content you write in the editor. You can refer to the View component in the Github repository for an example that retrieve the files content and fill an iframe.

The view can subscribe to a _Run_ event. If there is any subscriber, a "Run" button will appear in the file bar to trigger the event and notify the subscribers. The View can therefore do its job at this moment. An example is available in the View component in the Github repository.

_Note: Vertical paddings and margins impact the overflow of the page. By using the Playground as demonstrated, you should avoid providing padding top and bottom to the customizable parts of the playground._

The Playground uses @uiw/react-codemirror as editor.

## Containerized use

You can also use this playground inside a container. The playground will automatically fit the container depending on its size:
```js
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground View={View} defaultFiles={defaultFiles} height={600} />
  </PlaygroundProvider>
  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground
      View={View} 
      defaultFiles={defaultFiles}
      width={400}
      height={`300px`} // Size props also accept string
      wrapperStyle={{ flexShrink: 0 }} // The first Playground has no width set which default to 100%, preventing shrinking here is therefore necessary
    />
  </PlaygroundProvider>
</div>
```

Or if your container already has fixed sizes:
```jsx
<div style={{ width: 500, height: 500 }}>
  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground 
      View={View} 
      defaultFiles={defaultFiles}
      height={`100%`}
    />
  </PlaygroundProvider>
</div>
```

## Multiple files + customization
By default, the playground is locked with the default files provided. The _multiFile_ props allows you to add more files. The file name must be unique (deleted elements included). You can delete a file and get it back with the revert button.

You can provide a custom theme through the _codeMirrorThemes_ provider prop. If you do so, you will also need to provides few colors to the fileBar through the _fileBarThemes_ provider prop. Both prop are optionnal and using one does not require to provide the second and vice versa but the themes won't match.
The filebar uses the default CodeMirror themes (_oneDark_ and its light version) if something is not provided:
```jsx
import { basicDark, basicLight } from '@uiw/codemirror-themes-all';

// Don't be mean, these colors are awesome !
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

const codeMirrorTheme = { 
  light: basicLight, 
  dark: basicDark 
};

<PlaygroundProvider fileBarThemes={theme} codeMirrorThemes={codeMirrorTheme} defaultFiles={defaultFiles}>
  <Playground 
    multiFile
    View={View}
    Header={Header}
    View={View}
    defaultFiles={defaultFiles}
    wrapperStyle={{
      paddingRight: 10,
      paddingLeft: 10,
    }}
    paneWrapperStyle={{
      boxShadow: '0px 0px 3px rgba(25, 25, 25, .5)',
      borderRadius: 4,
    }}
  />
</PlaygroundProvider>
```
As you can see, you can also provide a Header component which allows you to change the Playground orientation and toggle a fullscreen mode. You can lso access all the props and the context inside if needed.

The provided colors, depending on the current theme selected, are used to build a color map that is provided to the Playground. Multiple Playground can be used in the same page with different colors theme.

# Types
You can find all the type on the github page. Here are those I would like to see if I was a user:
## PlaygroundProviderProps
```ts
interface PlaygroundProviderProps {
  children: React.ReactNode;
  /**
   * The default files to display in the file bar.
   */
  defaultFiles: Array<UserFile>;
  /**
   * Customize the files bar.
   */
  fileBarThemes?: FileBarThemes;
  /**
   * CodeMirror compatible themes: light and dark.
   */
  codeMirrorThemes?: CodeMirrorThemes;
}
```
## PlaygroundContext
```ts
export interface PlaygroundContext {
  fileBarThemes: FileBarThemes;
  codeMirrorThemes: CodeMirrorThemes;
  events: EventBus;
  playgroundState: PlaygroundState;
  setPlaygroundState: React.Dispatch<React.SetStateAction<PlaygroundState>>;
  updateFileState: (newState: EditorState) => void;
  wrapperRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  paneWrapperRef: RefObject<HTMLDivElement>;
  editorPaneRef: RefObject<HTMLDivElement>;
  viewPaneRef: RefObject<HTMLDivElement>;
  handleRef: RefObject<HTMLDivElement>;
  fileBarRef: RefObject<HTMLDivElement>;
  codeMirrorRef: React.MutableRefObject<ReactCodeMirrorRef | undefined>;
}
```
## PlaygroundState
```ts
export interface PlaygroundState {
  /**
   * The Playground orientation.
   */
  direction: 'row' | 'column';
  /**
   * Triggers when the fullscreen is asked, before the style is applied.
   */
  isFullScreenStarted: boolean;
  /**
   * Triggers when the style is changed for a fullscreen view.
   */
  isFullScreenFinished: boolean;
  /**
   * The list of all the files (deleted element not included).
   */
  files: Array<CodeMirrorFile>;
  /**
   * The currently selected file name.
   */
  currentFileName: string;
  /**
   * The editor config.
   */
  editorConfig: EditorConfig;
}
```
## FileBarThemes and colors
```ts
export interface FileBarThemeColors {
  /**
   * The text color.
   */
  color: string;
  /**
   * The files bar background.
   */
  background: string;
  /**
   * Basically a red color for remove buttons.
   */
  danger: string;
  /**
   * The indicator under the active file. Its color is also applied to the handle for harmony, but can be overriden with the Playground's HandleCOlor props.
   */
  indicator: string;
  /**
   * The hover color.
   */
  hover: string;
}

export interface FileBarThemes {
  light: {
    colors: FileBarThemeColors;
  };
  dark: {
    colors: FileBarThemeColors;
  };
}
```
