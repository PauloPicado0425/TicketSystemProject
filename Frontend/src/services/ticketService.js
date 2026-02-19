export async function getTickets(
  page = 0,
  size = 10,
  sort = "createdAt,desc",
  status = "ALL",
  title = ""
) {
  const url = new URL("/api/tickets", window.location.origin);
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));
  url.searchParams.set("sort", sort);

 
  if (status && status !== "ALL") url.searchParams.set("status", status);
  if (title && title.trim().length > 0) url.searchParams.set("title", title.trim());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTicket(body) {
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTicket(id, body) {
  const res = await fetch(`/api/tickets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTicket(id) {
  const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}