import { BaseIconProps } from './PlusIcon';

export const RemoveIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...rest
}: BaseIconProps) => {
  return (
    <abbr title="Remove">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke={color}
        strokeWidth={strokeWidth}
        {...rest}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </abbr>
  );
};
