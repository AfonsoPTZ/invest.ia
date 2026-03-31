import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes with twMerge for resolving conflicts
 * 
 * Usage:
 * cn("px-2 py-1", "px-3") // "px-3 py-1"
 * cn("px-2", { "py-2": true }) // "px-2 py-2"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
