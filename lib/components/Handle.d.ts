import { RefObject } from 'react';
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
export declare const Handle: (props: HandleProps) => import("react/jsx-runtime").JSX.Element;
