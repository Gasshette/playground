import { BaseIconProps } from './PlusIcon';

export const RevertIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...rest
}: BaseIconProps) => {
  return (
    <abbr title="Revert">
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
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    </abbr>
  );
};
