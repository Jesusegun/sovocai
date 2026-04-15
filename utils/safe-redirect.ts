/**
 * Validates a redirect path to prevent open-redirect attacks.
 * Only allows relative paths starting with a single forward slash.
 *
 * @param input - The raw redirect path from user input
 * @returns A safe, validated path (defaults to '/' if input is suspicious)
 */
export function getSafeNextPath(input: string): string {
  if (!input || !input.startsWith('/')) return '/'
  if (input.startsWith('//')) return '/'
  if (input.includes('\\')) return '/'
  return input
}
