import { BaseIconProps } from './PlusIcon';

export const PlayIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...rest
}: BaseIconProps) => {
  return (
    <abbr title="Run">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke={color}
        strokeWidth={strokeWidth}
        {...rest}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
        />
      </svg>
    </abbr>
  );
};
