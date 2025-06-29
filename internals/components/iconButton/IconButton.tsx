import { CSSProperties, forwardRef, useMemo } from 'react';
import './IconButton.scss';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'success' | 'info' | 'warning' | 'danger';
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
}

export const IconButton = forwardRef<never, IconButtonProps>((props, ref) => {
  const { children, style, variant = 'info', className, ...rest } = props;

  const classes = useMemo(
    () => `btn btn-${variant} ${className ? className : ''}`.trim(),
    [variant, className]
  );

  return (
    <button ref={ref} className={classes} style={style} {...rest}>
      {children}
    </button>
  );
});
