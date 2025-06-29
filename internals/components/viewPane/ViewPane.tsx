import { PlaygroundProps, usePlaygroundContext } from '@lib/index';

export const ViewPane = (props: PlaygroundProps) => {
  const { View, viewPaneOverflow = 'hidden' } = props;
  const { viewPaneRef } = usePlaygroundContext();

  return (
    <div ref={viewPaneRef} style={{ flex: 1, overflow: viewPaneOverflow }}>
      <View {...props} />
    </div>
  );
};
