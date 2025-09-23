import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function alertError() {
  alert("Something went wrong. If this has happened more than once, text miller.")
}
