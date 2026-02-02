export default function Button({ 
  children,       // Text inside button
  variant,        // 'primary' or 'secondary'
  onClick,        // What happens when clicked
  type 
}) {
  // Set default values
  const buttonVariant = variant || 'primary';
  const buttonType = type || 'button';
  
  return (
    <button 
      className={`btn btn-${buttonVariant}`}
      onClick={onClick}
      type={buttonType}
    >
      {children}
    </button>
  );
}