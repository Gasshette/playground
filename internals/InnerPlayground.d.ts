import { PlaygroundProps } from '../lib/types/PlaygroundProps';
interface InnerPlaygroundProps extends PlaygroundProps {
  paneWrapperHeight: string | number;
}
export declare const InnerPlayground: (
  props: InnerPlaygroundProps
) => import('react/jsx-runtime').JSX.Element;
export {};
