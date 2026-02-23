import { useEffect, useState } from "react";
import { getTickets, createTicket } from "./services/ticketService";
import { clearToken } from "./services/api";

export default function Tickets({ onLogout }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTickets() {
    setLoading(true);
    setMsg("");
    try {
      const page = await getTickets(0, 10);
      setTickets(page?.content || []);
    } catch (err) {
      setMsg("Error cargando: " + (err?.message || "Error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setMsg("");

    try {
      await createTicket({ title, description });
      setTitle("");
      setDescription("");
      await loadTickets();
    } catch (err) {
      setMsg("Error creando: " + (err?.message || "Error"));
    }
  }

  function logout() {
    clearToken();
    onLogout?.();
  }

  return (
    <div>
      <h2>Tickets</h2>
      <button onClick={logout} disabled={loading}>
        Cerrar sesión
      </button>

      <form onSubmit={onCreate} style={{ marginTop: 12 }}>
        <input
          placeholder="título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <br />
        <input
          placeholder="descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Crear"}
        </button>
      </form>

      {msg && <p>{msg}</p>}

      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <b>{t.title}</b> - {t.description} ({t.status})
          </li>
        ))}
      </ul>
    </div>
  );
}