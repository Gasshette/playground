import { usePlaygroundContext } from '@lib/index';
import { MoonIcon } from '@int/icons/MoonIcon';
import { SunIcon } from '@int/icons/SunIcon';
import { CheckIcon } from '@int/icons/CheckIcon';
import './menu.scss';

interface MenuConfig {
  key: string;
  content: React.ReactNode;
  action: (...args: Array<unknown>) => void;
}

const FlexDiv = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
    {children}
  </div>
);

export const Menu = () => {
  const {
    fileBarThemes: { light, dark },
    setPlaygroundState,
    playgroundState: {
      editorConfig: { lineWrapping, theme }
    }
  } = usePlaygroundContext();

  const config: Array<MenuConfig> = [
    {
      key: crypto.randomUUID(),
      content: (
        <FlexDiv>
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />} Theme: {theme}
        </FlexDiv>
      ),
      action: () => {
        setPlaygroundState((prev) => {
          return {
            ...prev,
            editorConfig: {
              ...prev.editorConfig,
              theme: prev.editorConfig.theme === 'dark' ? 'light' : 'dark'
            }
          };
        });
      }
    },
    {
      key: crypto.randomUUID(),
      content: (
        <FlexDiv>
          <CheckIcon
            color={
              lineWrapping
                ? theme === 'dark'
                  ? dark.colors.color
                  : light.colors.color
                : 'transparent'
            }
          />
          <p>{'  '}Line wrapping</p>
        </FlexDiv>
      ),
      action: () => {
        setPlaygroundState((prev) => {
          return {
            ...prev,
            editorConfig: { ...prev.editorConfig, lineWrapping: !prev.editorConfig.lineWrapping }
          };
        });
      }
    }
  ];

  return (
    <div className="menu">
      {config.map((item) => (
        <div key={item.key} onClick={item.action}>
          <div>
            <div>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
