import type { PropsWithChildren, ButtonHTMLAttributes } from 'react'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  gray?: boolean
  small?: boolean
  className?: string
}

export const Button = ({ className = '', small = false, gray = false, ...props }: ButtonProps) => {
  const sizeClasses = small ? 'px-2 py-1' : 'px-4 py-2 font-bold'
  const colorClasses = gray
    ? 'bg-gray-400 focus-visible:bg-gray-300 hover:bg-gray-300'
    : 'bg-blue-500 focus-visible:bg-blue-400 hover:bg-blue-400'

  return (
    <button
      className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  )
}
