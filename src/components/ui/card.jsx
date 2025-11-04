export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-lg border ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  )
}

