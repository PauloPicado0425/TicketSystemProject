import { useState } from "react";
import { createTicket } from "../services/ticketService.js";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTicket({ title, description });
      setTitle("");
      setDescription("");
      onCreated?.();
    } catch (err) {
      setError(err.message || "Error creando ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <h3 style={{ textAlign: "center", marginBottom: 12 }}>Crear ticket</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 10 }}
          disabled={loading}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ flex: 1, padding: 10 }}
          disabled={loading}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 8, padding: 10, border: "1px solid #ff6b6b", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
    </form>
  );
}