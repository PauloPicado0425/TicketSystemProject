import { useEffect, useState } from "react";
import { updateTicket } from "../services/ticketService.js";

export default function TicketEditModal({ open, ticket, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticket) return;
    setTitle(ticket.title ?? "");
    setDescription(ticket.description ?? "");
    setStatus(ticket.status ?? "OPEN");
    setError("");
    setLoading(false);
  }, [ticket]);

  if (!open || !ticket) return null;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateTicket(ticket.id, { title, description, status });
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Error guardando cambios");
    } finally {
      setLoading(false);
    }
  }

  function closeOnBackdrop(e) {
    if (e.target?.dataset?.backdrop === "1") onClose?.();
  }

  return (
    <div
      data-backdrop="1"
      onMouseDown={closeOnBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "min(700px, 100%)",
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Editar Ticket #{ticket.id}</h2>
          <button onClick={onClose} disabled={loading}>✕</button>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Título</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 10 }} disabled={loading} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Descripción</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} style={{ padding: 10 }} disabled={loading} />
            </label>

            <label style={{ display: "grid", gap: 6, maxWidth: 240 }}>
              <span>Estado</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </label>

            {error && <div style={{ padding: 10, border: "1px solid #ff6b6b", borderRadius: 8 }}>{error}</div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
              <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}