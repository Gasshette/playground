import { PlaygroundProps } from './PlaygroundProps';
export interface PlaygroundHeaderProps extends PlaygroundProps {
    isFullScreen: boolean;
    isVertical: boolean;
    handleFullScreen: () => void;
    setIsVertical: (value: React.SetStateAction<boolean>) => void;
}
