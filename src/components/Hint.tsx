import { BaseProps } from '../types';

export const Hint = (props: BaseProps) => (
  <p style={{ color: '#888', paddingBottom: 10 }}>
    &#9432; <span style={{ fontStyle: 'italic' }}>{props.children}</span>
  </p>
);
