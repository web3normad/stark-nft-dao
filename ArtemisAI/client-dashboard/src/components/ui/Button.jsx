import React from 'react';

const Button = React.forwardRef(({ 
  className = "",
  variant = "default",
  size = "default",
  children,
  disabled = false,
  type = "button",
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
    outline: "border border-gray-200 hover:bg-gray-100 text-gray-700",
  };

  // Size styles
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-sm",
    lg: "h-12 px-6 py-3 text-lg",
  };

  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

// Change to default export
export default Button;