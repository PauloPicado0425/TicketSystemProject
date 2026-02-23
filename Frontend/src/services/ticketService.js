import { apiFetch } from "./api";

export async function getTickets(
  page = 0,
  size = 10,
  sort = "createdAt,desc",
  status = "ALL",
  title = ""
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", sort);

  if (status && status !== "ALL") params.set("status", status);
  if (title && title.trim().length > 0) params.set("title", title.trim());

  return apiFetch(`/api/tickets?${params.toString()}`);
}

export async function createTicket({ title, description }) {
  return apiFetch("/api/tickets", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export async function updateTicket(id, body) {
  return apiFetch(`/api/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteTicket(id) {
  return apiFetch(`/api/tickets/${id}`, {
    method: "DELETE",
  });
}