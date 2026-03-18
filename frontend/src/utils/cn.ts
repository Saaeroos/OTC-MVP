import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally join class names using clsx and tailwind-merge.
 * @param {...ClassValue[]} inputs - Class values to be conditionally joined.
 * @returns {string} - The merged class names.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
