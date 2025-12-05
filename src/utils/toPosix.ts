/**
 * Convert path to posix format
 * @example 'C:\my\path' -> 'C:/my/path'
 */
export const toPosix = (p: string) => p.replace(/\\/g, '/');
