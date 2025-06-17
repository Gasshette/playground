import { usePlaygroundContext } from '../../lib/Contexts/PlaygroundProvider';

export const Header = () => {
  const { setPlaygroundState, playgroundState } = usePlaygroundContext();
  const { isFullScreen } = playgroundState;

  const handleDirection = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      direction: prev.direction === 'row' ? 'column' : 'row'
    }));
  };

  const handleFullScreen = () => {
    setPlaygroundState((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
  };

  return (
    <div style={{ display: 'flex', gap: 2, boxSizing: 'border-box', paddingBottom: 10 }}>
      <button onClick={handleDirection}>Change direction</button>
      <button onClick={handleFullScreen}>{isFullScreen ? 'Unset' : 'Set'} fullscreen</button>
    </div>
  );
};
