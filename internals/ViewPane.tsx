import { usePlaygroundContext } from '../lib/Contexts/PlaygroundProvider';
import { PlaygroundProps } from '../lib/types/PlaygroundProps';

export const ViewPane = (props: PlaygroundProps) => {
  const { View } = props;
  const { viewPaneRef } = usePlaygroundContext();

  return (
    <div ref={viewPaneRef} style={{ flex: 1, overflow: 'hidden' }}>
      <View />
    </div>
  );
};
