import { useState, useRef, CSSProperties, useEffect } from 'react';
import { PlaygroundProps } from '../lib/types/PlaygroundProps';
import { usePlaygroundContext } from '../lib/Contexts/PlaygroundProvider';

export const Handle = (props: PlaygroundProps) => {
  const { handleClassNames, handleStyle } = props;

  const [hover, setHover] = useState<boolean>(false);

  const { playgroundState, paneWrapperRef, editorPaneRef, viewPaneRef, handleRef } =
    usePlaygroundContext();
  const { direction, isFullScreenDOMApplied } = playgroundState;

  const lockHover = useRef(false);
  const timeout = useRef<NodeJS.Timeout>();

  const style: CSSProperties = {
    position: 'absolute',
    ...(direction === 'row'
      ? {
          top: 0
        }
      : {
          left: 0
        }),
    width: direction === 'row' ? 6 : '100%',
    height: direction === 'row' ? '100%' : 6,
    backgroundColor: hover ? '#0883F2' : 'transparent'
  };

  const handleMouseEnter = () => {
    if (handleRef.current)
      handleRef.current.style.cursor = direction === 'row' ? 'col-resize' : 'row-resize';

    if (!hover) {
      timeout.current = setTimeout(() => setHover(true), 200);
    }
  };

  const handleMouseLeave = () => {
    if (handleRef.current) handleRef.current.style.cursor = 'unset';
    if (!lockHover.current) {
      if (timeout.current) clearTimeout(timeout.current);
      setHover(false);
    }
  };

  function enableRatioResize(
    container: HTMLElement,
    leftPane: HTMLElement,
    rightPane: HTMLElement,
    handle: HTMLElement,
    direction: 'row' | 'column' = 'row'
  ) {
    const onPointerDown = (e: PointerEvent) => {
      lockHover.current = true;

      rightPane.style.overflow = 'hidden';

      // Depending on direction, choose relevant axis and sizes
      const startPos = direction === 'row' ? e.clientX : e.clientY;
      const containerSize =
        direction === 'row'
          ? container.getBoundingClientRect().width
          : container.getBoundingClientRect().height;
      const leftSize =
        direction === 'row'
          ? leftPane.getBoundingClientRect().width
          : leftPane.getBoundingClientRect().height;

      const onPointerMove = (e: PointerEvent) => {
        const currentPos = direction === 'row' ? e.clientX : e.clientY;
        const delta = currentPos - startPos;
        const newLeftSize = leftSize + delta;

        // Clamp to keep minimal size
        const min = 0;
        const max = containerSize - min;
        const clampedLeft = Math.max(min, Math.min(newLeftSize, max));

        const leftRatio = clampedLeft / containerSize;
        const rightRatio = 1 - leftRatio;

        // Update flex ratios for both panes
        leftPane.style.flex = `${leftRatio} 0 0%`;
        rightPane.style.flex = `${rightRatio} 0 0%`;

        // Update handle position: left for row, top for column
        if (direction === 'row') {
          handle.style.left = `${clampedLeft - 3}px`;
          handle.style.top = '0px';
        } else {
          handle.style.top = `${clampedLeft - 3}px`;
          handle.style.left = '0px';
        }
      };

      const onPointerUp = () => {
        lockHover.current = false;
        clearTimeout(timeout.current);
        setHover(false);

        rightPane.style.overflow = 'auto';

        document.removeEventListener('pointermove', onPointerMove, true);
        document.removeEventListener('pointerup', onPointerUp, true);
      };

      document.addEventListener('pointermove', onPointerMove, true);
      document.addEventListener('pointerup', onPointerUp, true);
    };

    handle.addEventListener('pointerdown', onPointerDown, true);
  }

  useEffect(() => {
    if (editorPaneRef.current && handleRef.current) {
      const rect = editorPaneRef.current.getBoundingClientRect();

      if (direction === 'row') {
        handleRef.current.style.left = `${rect.width - 3}px`;
      } else {
        handleRef.current.style.top = `${rect.height - 3}px`;
      }
    }
  }, [direction, isFullScreenDOMApplied, editorPaneRef.current, handleRef.current]);

  useEffect(() => {
    if (
      paneWrapperRef.current &&
      editorPaneRef.current &&
      viewPaneRef.current &&
      handleRef.current
    ) {
      enableRatioResize(
        paneWrapperRef.current,
        editorPaneRef.current,
        viewPaneRef.current,
        handleRef.current,
        direction
      );
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [
    direction,
    isFullScreenDOMApplied,
    paneWrapperRef.current,
    editorPaneRef.current,
    viewPaneRef.current,
    handleRef.current
  ]);

  return (
    <div
      ref={handleRef}
      style={{ ...style, ...handleStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`playgroundHandle ${handleClassNames ?? ''}`.trim()}></div>
  );
};
