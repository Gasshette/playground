import { Playground, PlaygroundProps } from '@lib/index';
import { Header } from './Header';
import { View } from './View';

export const MultiFilePlayground = (props: Omit<PlaygroundProps, 'View'>) => {
  return (
    <Playground
      {...props}
      multiFile
      Header={Header}
      View={View}
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
    />
  );
};
