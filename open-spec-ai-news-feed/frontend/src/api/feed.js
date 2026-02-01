const API_URL = '/api/feed';

export async function fetchFeed(topics) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topics: topics.map((t) => ({ name: t.name, query: t.query })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error: ${response.status}`);
  }

  const data = await response.json();
  return data.articles;
}
