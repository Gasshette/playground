import './Toast.scss';

interface ToastProps {
  content: string | React.ReactNode;
  variant?: 'error';
}
export const Toast = (props: ToastProps) => {
  const { variant = 'error', content } = props;

  return <div className={`toast toast-${variant}`}>{content}</div>;
};
