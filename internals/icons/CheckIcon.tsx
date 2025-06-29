import { BaseIconProps } from './PlusIcon';

export const CheckIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...rest
}: BaseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth={strokeWidth}
      {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
};
