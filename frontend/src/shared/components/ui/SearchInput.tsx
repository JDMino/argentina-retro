interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-accent ${className}`}
    />
  )
}