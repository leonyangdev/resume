import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  if (!date) return ''
  if (date === 'present') return '至今'
  const [year, month] = date.split('-')
  return `${year}年${month ? month + '月' : ''}`
}
