import { useEffect, useState } from "react";
import "./App.css";
import { getTickets } from "./services/ticketService";

export default function App() {
  const [content, setContent] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTickets(p = pageNumber, s = pageSize) {
    setLoading(true);
    setError("");

    try {
      const data = await getTickets(p, s, "createdAt,desc");

      setContent(data.content ?? []);
      setPageNumber(data.number ?? 0);
      setPageSize(data.size ?? s);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (e) {
      setError(e.message || "Error cargando tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPrev() {
    if (pageNumber > 0) loadTickets(pageNumber - 1, pageSize);
  }

  function onNext() {
    if (pageNumber + 1 < totalPages) loadTickets(pageNumber + 1, pageSize);
  }

  function onChangeSize(e) {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    loadTickets(0, newSize);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Tickets</h1>

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
              <th style={th}>Estado</th>
              <th style={th}>Creado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={td} colSpan={4}>
                  Cargando...
                </td>
              </tr>
            ) : content.length === 0 ? (
              <tr>
                <td style={td} colSpan={4}>
                  No hay tickets
                </td>
              </tr>
            ) : (
              content.map((t) => (
                <tr key={t.id}>
                  <td style={td}>{t.id}</td>
                  <td style={td}>{t.title || <i>(sin título)</i>}</td>
                  <td style={td}>{t.status}</td>
                  <td style={td}>{formatDate(t.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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

