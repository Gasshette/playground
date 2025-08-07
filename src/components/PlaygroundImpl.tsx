import { indentWithTab, keymap, Playground, PlaygroundProps } from '../../lib';
import { Header } from './Header';
import { View } from './View';

export const PlaygroundImpl = (props: Omit<PlaygroundProps, 'View'>) => {
  return (
    <Playground
      {...props}
      wrapperStyle={{
        paddingRight: 10,
        paddingLeft: 10,
        ...props.wrapperStyle
      }}
      paneWrapperStyle={{
        boxShadow: '0px 0px 3px rgba(25, 25, 25, .5)',
        borderRadius: 4,
        ...props.paneWrapperStyle
      }}
      codeMirrorProps={{
        ...props.codeMirrorProps,
        extensions: [keymap.of([indentWithTab])]
      }}
      Header={Header}
      View={View}
    />
  );
};
