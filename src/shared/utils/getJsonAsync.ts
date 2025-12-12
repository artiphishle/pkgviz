const headers = { contentType: 'application/json' };

/**
 * Fetches JSON data from the specified URL.
 * @param url - The URL to fetch JSON data from.
 * @returns The fetched JSON data typed as T.
 */
export async function getJsonAsync<T>(url: string) {
  const res = await fetch(url, { headers });
  const json: T = await res.json();

  return json;
}
