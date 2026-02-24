const KILN_BASE_URL = "https://api.kiln.fi/v1";

export async function kilnFetch(
  path: string,
  params?: Record<string, string>
): Promise<Response> {
  const token = process.env.KILN_API_TOKEN;
  if (!token) {
    throw new Error("KILN_API_TOKEN environment variable is not set");
  }

  const url = new URL(`${KILN_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
}
