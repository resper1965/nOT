import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getRiskColor(level: 'critical' | 'high' | 'medium' | 'low'): string {
  const colors = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-blue-500',
  }
  return colors[level]
}

export function getRiskBgColor(level: 'critical' | 'high' | 'medium' | 'low'): string {
  const colors = {
    critical: 'bg-red-500/10 border-red-500/20',
    high: 'bg-orange-500/10 border-orange-500/20',
    medium: 'bg-yellow-500/10 border-yellow-500/20',
    low: 'bg-blue-500/10 border-blue-500/20',
  }
  return colors[level]
}
