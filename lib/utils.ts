// lib/utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSlugFromUrl(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('?')[0];
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}