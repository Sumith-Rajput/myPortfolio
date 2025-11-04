export function Button({ children, className = '', variant = 'default', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variantClasses = {
    default: 'bg-indigo-500 text-white hover:bg-indigo-600',
    outline: 'border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

