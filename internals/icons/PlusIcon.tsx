export interface BaseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string; // for width & height
  color?: string; // stroke color
  strokeWidth?: number; // controls line thickness
}
export const PlusIcon = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...rest
}: BaseIconProps) => {
  return (
    <abbr title="Add">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke={color}
        strokeWidth={strokeWidth}
        {...rest}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </abbr>
  );
};
