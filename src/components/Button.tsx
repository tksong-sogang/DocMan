import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary'
}

export default function Button({ variant = 'default', className, type = 'button', ...rest }: Props) {
  const classes = ['btn', variant === 'primary' && 'btn-primary', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
