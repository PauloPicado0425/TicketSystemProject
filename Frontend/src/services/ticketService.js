const API_URL = "http://localhost:8080/api/tickets";

export async function getTickets(page = 0, size = 10, sort = "createdAt,desc") {
  const url = new URL(API_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));
  url.searchParams.set("sort", sort);

  const res = await fetch(url.toString());

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} - ${txt}`);
  }

  return res.json();
}
