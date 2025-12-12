/**
 * Converts Windows-style backslashes in a file path to POSIX-style forward slashes.
 * @example 'C:\\Users\\User\\Documents\\Project' => 'C:/Users/User/Documents/Project'
 */
export const toPosix = (p: string) => p.replace(/\\/g, '/');
