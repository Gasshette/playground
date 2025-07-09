# React Modular Playground

A customizable and modular playground for building interactive React applications with multiple files, theming, and custom views.

---

## 🚀 Basic Usage

The simplest version extends to the full height of the screen:

```tsx
<PlaygroundProvider defaultFiles={defaultFiles}>
  <Playground View={View} />
</PlaygroundProvider>
```

### `defaultFiles`

These are the initial files displayed in the file bar:

```tsx
const defaultFiles: Array<UserFile> = [
  {
    name: "demo.html",
    content: "<h1>My Title</h1>\n<p>My content</p>"
  }
];
```

### Notes

- **The `PlaygroundProvider` is required**: it provides all context values, states, and refs.
- **The `View` component is required**: it defines how to render the content written in the editor. An example implementation is available in the GitHub repository (using an iframe, for instance).
- **Run event**: If the `View` component subscribes to a custom "Run" event, a "Run" button will appear in the UI to trigger the event. This allows actions like re-rendering an iframe with the current editor content.

⚠️ _Avoid vertical padding and margin around the playground to prevent layout overflow._

> Uses [`@uiw/react-codemirror`](https://github.com/uiwjs/react-codemirror) under the hood.

---

## 📦 Containerized Usage

The playground automatically adapts to its container.

### Responsive example:

```tsx
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground View={View} height={600} />
  </PlaygroundProvider>

  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground
      View={View}
      width={400}
      height="300px"
      wrapperStyle={{ flexShrink: 0 }}
    />
  </PlaygroundProvider>
</div>
```

### Fixed-size container:

```tsx
<div style={{ width: 500, height: 500 }}>
  <PlaygroundProvider defaultFiles={defaultFiles}>
    <Playground View={View} height="100%" />
  </PlaygroundProvider>
</div>
```

---

## 📁 Multiple Files & Customization

### Enable multi-file editing:

Use the `multiFile` prop to allow creating, deleting, and restoring files (via a "revert" button). File names must be unique—even for deleted files.

### Custom Themes

You can customize both:

- CodeMirror themes (`codeMirrorThemes`)
- File bar colors (`fileBarThemes`)

> You can use either or both. If nothing is provided, default to CodeMirror’s `oneDark` (dark) and its light equivalent.

```tsx
import { basicDark, basicLight } from '@uiw/codemirror-themes-all';

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
```

### Putting it together:

```tsx
<PlaygroundProvider
  fileBarThemes={theme}
  codeMirrorThemes={codeMirrorTheme}
  defaultFiles={defaultFiles}
>
  <Playground
    multiFile
    View={View}
    Header={Header}
    wrapperStyle={{ paddingLeft: 10, paddingRight: 10 }}
    paneWrapperStyle={{
      boxShadow: '0 0 3px rgba(25, 25, 25, 0.5)',
      borderRadius: 4
    }}
  />
</PlaygroundProvider>
```

- `Header`: Optional component to toggle fullscreen or change layout orientation.
- The theme is dynamically chosen based on current appearance.
- Multiple instances can coexist with different themes.

---

## 📘 Types

Here are the most important TypeScript types for developers:

### `PlaygroundProps`

```ts
interface PlaygroundProps {
  View: React.FunctionComponent<PlaygroundProps>;
  Header?: React.FunctionComponent<PlaygroundProps>;
  width?: string | number;
  height?: string | number;
  wrapperStyle?: CSSProperties;
  wrapperClassNames?: string;
  paneWrapperStyle?: CSSProperties;
  paneWrapperClassNames?: string;
  handleStyle?: CSSProperties;
  handleClassNames?: string;
  codeMirrorProps?: ReactCodeMirrorProps;
  multiFile?: boolean;
  handleColor?: string;
  viewPaneOverflow?: string;
}
```

### `PlaygroundProviderProps`

```ts
interface PlaygroundProviderProps {
  children: React.ReactNode;
  defaultFiles: Array<UserFile>;
  fileBarThemes?: FileBarThemes;
  codeMirrorThemes?: CodeMirrorThemes;
}
```

### `PlaygroundContext`

```ts
interface PlaygroundContext {
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

### `PlaygroundState`

```ts
interface PlaygroundState {
  direction: 'row' | 'column';
  isFullScreenStarted: boolean;
  isFullScreenFinished: boolean;
  files: Array<CodeMirrorFile>;
  currentFileName: string;
  editorConfig: EditorConfig;
}
```

### `FileBarThemes` & Colors

```ts
interface FileBarThemeColors {
  color: string;
  background: string;
  danger: string;
  indicator: string;
  hover: string;
}

interface FileBarThemes {
  light: { colors: FileBarThemeColors };
  dark: { colors: FileBarThemeColors };
}
```