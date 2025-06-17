import { BaseProps } from '../types';

export const Title = (props: BaseProps) => {
  return (
    <h1
      style={{
        fontSize: '1.7rem',
        fontWeight: 600,
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
      {props.children}
    </h1>
  );
};
