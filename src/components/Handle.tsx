import { RefObject, CSSProperties, useEffect } from 'react';
import { HANDLE_THICKNESS } from './playground';
import { useSizes } from '../hooks/useSizes';

export type ResizeEvent = Omit<HandleProps, 'onBeforeResize' | 'onAfterResize'>;

export interface HandleProps {
  /**
   * Whether the handle is vertical or not.
   * It is the opposite of the isVertical from the Playground component
   * (If the playground is vertical, the handle is horizontal to split the editor and the view)
   */
  vertical?: boolean;

  /**
   * The ref of the container
   */
  containerRef: RefObject<HTMLDivElement>;

  /**
   * The ref of the handle
   */
  handleRef: RefObject<HTMLDivElement>;

  /**
   * The ref of the editor
   */
  firstDivRef: RefObject<HTMLDivElement>;

  /**
   * The ref of the view
   */
  secondDivRef: RefObject<HTMLDivElement>;

  /**
   * The style of the handle
   */
  style?: React.CSSProperties;

  /**
   * The className of the handle
   */
  className?: string;
  onBeforeResize?: (props: ResizeEvent) => void;
  onAfterResize?: (props: ResizeEvent) => void;
}

export const Handle = (props: HandleProps) => {
  const {
    vertical,
    handleRef,
    firstDivRef,
    secondDivRef,
    containerRef,
    style,
    className,
    onAfterResize,
    onBeforeResize
  } = props;

  const { saveSizes, getSizes } = useSizes(firstDivRef, secondDivRef);

  const handleStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(25, 25, 25, .3)',
    borderRadius: '2px',
    width: vertical ? `${HANDLE_THICKNESS}px` : '100%',
    height: vertical ? 'unset' : `${HANDLE_THICKNESS}px`,
    cursor: vertical ? 'ew-resize' : 'ns-resize',
    ...style
  };

  const manageOverflow = (isEnabled: boolean) => {
    if (!firstDivRef.current || !secondDivRef.current) return;
    // Disable overflow to prevent scrolling when resizing
    firstDivRef.current.style.overflow = !isEnabled ? 'hidden' : 'auto';
    secondDivRef.current.style.overflow = !isEnabled ? 'hidden' : 'auto';
  };

  // Edit the width or height of the first and second divs based on the mouse position
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !firstDivRef.current || !secondDivRef.current) return;

    manageOverflow(false);

    const containerRect = containerRef.current.getBoundingClientRect();

    if (vertical) {
      const x = e.clientX - containerRect.left;
      firstDivRef.current.style.width = `${x}px`;
      secondDivRef.current.style.width = `${containerRect.width - x}px`;
      firstDivRef.current.style.height = '100%';
    } else {
      const y = e.clientY - containerRect.top;
      firstDivRef.current.style.height = `${y}px`;
      secondDivRef.current.style.height = `${containerRect.height - y}px`;
      firstDivRef.current.style.width = '100%';
    }
  };

  const handleMouseUp = () => {
    manageOverflow(true);
    onAfterResize?.(props);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    saveSizes();
  };

  const handleMouseDown = () => {
    onBeforeResize?.(props);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const setSizes = () => {
    const sizes = getSizes();

    if (firstDivRef.current && secondDivRef.current) {
      if (vertical) {
        firstDivRef.current.style.width = sizes.firstDivSize?.width
          ? `${sizes.firstDivSize.width}px`
          : '100%';
        secondDivRef.current.style.width = sizes.secondDivSize?.width
          ? `${sizes.secondDivSize.width}px`
          : '100%';
        firstDivRef.current.style.height = '100%';
        secondDivRef.current.style.height = '100%';
      } else {
        firstDivRef.current.style.height = sizes.firstDivSize?.height
          ? `${sizes.firstDivSize.height}px`
          : '100%';
        secondDivRef.current.style.height = sizes.secondDivSize?.height
          ? `${sizes.secondDivSize.height}px`
          : '100%';
        firstDivRef.current.style.width = '100%';
        secondDivRef.current.style.width = '100%';
      }
    }
  };

  useEffect(() => {
    const createEventListener = () => {
      if (handleRef.current) {
        handleRef.current.addEventListener('mousedown', handleMouseDown);
      }
    };

    createEventListener();

    return () => {
      const removeEventListener = () => {
        if (handleRef.current) {
          handleRef.current.removeEventListener('mousedown', handleMouseDown);
        }
      };

      removeEventListener();
    };
  });

  useEffect(() => {
    setSizes();

    window.addEventListener('resize', setSizes);
    return () => {
      window.removeEventListener('resize', setSizes);
    };
  }, []);

  return (
    <div ref={handleRef} style={handleStyle} className={className}>
      <div
        style={{
          height: vertical ? '50px' : '1px',
          width: vertical ? '1px' : '50px',
          borderRadius: '3px',
          ...(vertical
            ? {
                borderLeft: '2px solid rgba(25, 25, 25, .25)',
                borderRight: '2px solid rgba(25, 25, 25, .25)'
              }
            : {
                borderTop: '2px solid rgba(25, 25, 25, .25)',
                borderBottom: '2px solid rgba(25, 25, 25, .25)'
              })
        }}
      />
    </div>
  );
};
