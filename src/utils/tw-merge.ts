import { clsx, type ClassValue } from 'clsx'
import { twMerge as tailwindMerge } from 'tailwind-merge'

export default function twMerge(...inputs: ClassValue[]): string {
	return tailwindMerge(clsx(inputs))
}
