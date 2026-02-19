import { useEffect, useMemo, useState } from "react";
import "./App.css";
import TicketForm from "./components/TicketForm.jsx";
import TicketEditModal from "./components/TicketEditModal.jsx";
import { getTickets, deleteTicket } from "./services/ticketService.js";

export default function App() {
  const [content, setContent] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [draftTitle, setDraftTitle] = useState("");   
  const [searchTitle, setSearchTitle] = useState(""); 

  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [editingTicket, setEditingTicket] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sortParam = useMemo(() => `${sortField},${sortDir}`, [sortField, sortDir]);

  async function loadTickets(
    p = pageNumber,
    s = pageSize,
    status = filterStatus,
    title = searchTitle,
    sort = sortParam
  ) {
    setLoading(true);
    setError("");

    try {
      const data = await getTickets(p, s, sort, status, title);

      setContent(data.content ?? []);
      setPageNumber(data.number ?? 0);
      setPageSize(data.size ?? s);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (e) {
      setError(e?.message || "Error cargando tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets(0, pageSize, filterStatus, searchTitle, sortParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTitle(draftTitle);
      loadTickets(0, pageSize, filterStatus, draftTitle, sortParam);
    }, 500);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTitle]);

  useEffect(() => {
    loadTickets(0, pageSize, filterStatus, searchTitle, sortParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortParam]);

  function onPrev() {
    if (pageNumber > 0) loadTickets(pageNumber - 1, pageSize, filterStatus, searchTitle, sortParam);
  }

  function onNext() {
    if (pageNumber + 1 < totalPages) {
      loadTickets(pageNumber + 1, pageSize, filterStatus, searchTitle, sortParam);
    }
  }

  function onChangeSize(e) {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    loadTickets(0, newSize, filterStatus, searchTitle, sortParam);
  }

  function onClear() {
    setFilterStatus("ALL");
    setDraftTitle("");
    setSearchTitle("");
    setSortField("createdAt");
    setSortDir("desc");
    loadTickets(0, pageSize, "ALL", "", "createdAt,desc");
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este ticket?")) return;

    try {
      await deleteTicket(id);

      const nextPage = Math.min(pageNumber, Math.max(totalPages - 1, 0));
      loadTickets(nextPage, pageSize, filterStatus, searchTitle, sortParam);
    } catch (e) {
      alert(e?.message || "Error eliminando ticket");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Tickets</h1>

      <TicketForm
        onCreated={() => loadTickets(0, pageSize, filterStatus, searchTitle, sortParam)}
      />
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Estado:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} disabled={loading}>
            <option value="ALL">Todos</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </label>

        <input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          placeholder="Buscar por título..."
          style={{ padding: 8, minWidth: 240, flex: "1 1 240px" }}
          disabled={loading}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Orden:
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            disabled={loading}
          >
            <option value="createdAt">Fecha</option>
            <option value="title">Título</option>
            <option value="status">Estado</option>
            <option value="id">ID</option>
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Dirección:
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            disabled={loading}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>

        <button onClick={onClear} disabled={loading}>
          Limpiar
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button onClick={onPrev} disabled={loading || pageNumber === 0}>
          ◀ Anterior
        </button>

        <button onClick={onNext} disabled={loading || pageNumber + 1 >= totalPages}>
          Siguiente ▶
        </button>

        <span style={{ marginLeft: 8 }}>
          Página <b>{totalPages === 0 ? 0 : pageNumber + 1}</b> de <b>{totalPages}</b>
        </span>

        <span style={{ marginLeft: "auto" }}>
          Tamaño:&nbsp;
          <select value={pageSize} onChange={onChangeSize} disabled={loading}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </span>
      </div>

      {error && (
        <div style={{ padding: 12, border: "1px solid #ff6b6b", borderRadius: 8, marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        Total: <b>{totalElements}</b>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Título</th>
              <th style={th}>Descripción</th>
              <th style={th}>Estado</th>
              <th style={th}>Creado</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={td} colSpan={6}>Cargando...</td>
              </tr>
            ) : content.length === 0 ? (
              <tr>
                <td style={td} colSpan={6}>No hay tickets</td>
              </tr>
            ) : (
              content.map((t) => (
                <tr key={t.id}>
                  <td style={td}>{t.id}</td>
                  <td style={td}>{t.title || <i>(sin título)</i>}</td>
                  <td style={td}>
                    {t.description
                      ? (t.description.length > 40 ? t.description.slice(0, 40) + "..." : t.description)
                      : <i>(sin descripción)</i>}
                  </td>
                  <td style={td}>{t.status}</td>
                  <td style={td}>{formatDate(t.createdAt)}</td>
                  <td style={td}>
                    <button
                      onClick={() => setEditingTicket(t)}
                      style={{ marginRight: 8 }}
                      disabled={loading}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={loading}
                      style={{ background: "#dc2626", color: "white" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TicketEditModal
        open={!!editingTicket}
        ticket={editingTicket}
        onClose={() => setEditingTicket(null)}
        onSaved={() => loadTickets(pageNumber, pageSize, filterStatus, searchTitle, sortParam)}
      />
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid #333",
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px 8px",
  borderBottom: "1px solid #222",
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}