import { useState } from "react";
import { register } from "./services/authService";

export default function Register({ onRegister, onGoLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await register(username, password); // guarda token en localStorage
      onRegister?.();
    } catch (err) {
      setMsg(err?.message || "Error registrando usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </form>

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onGoLogin} disabled={loading} style={{ width: "100%", padding: 10 }}>
          Ya tengo cuenta (Login)
        </button>
      </div>
    </div>
  );
}