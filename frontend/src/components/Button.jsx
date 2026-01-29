export const Button = ({ children, variant = 'default', size = 'md', onClick, disabled, type = 'button' }) => {
  const classes = `btn ${variant === 'primary' ? 'btn-primary' : ''} ${size === 'sm' ? 'btn-sm' : ''}`;
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};