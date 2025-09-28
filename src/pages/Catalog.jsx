import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_DOGS_API;

export default function Catalog() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // söktext och filter
  const [search, setSearch] = useState("");
  const [filterBreed, setFilterBreed] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Misslyckades hämta data: " + res.status);
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.record || data.records || data.data || []);
        setDogs(arr);
      })
      .catch((err) => setError(err.message || "Fel vid hämtning"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar hundlista…</p>;
  if (error) return <p style={{ color: "crimson" }}>Fel: {error}</p>;
  if (!dogs.length) return <p>Inga hundar hittades.</p>;

  // filtrera baserat på söktext och ras
  const filteredDogs = dogs.filter(d =>
    (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
    (!filterBreed || (d.breed || d.ras || "").toLowerCase() === filterBreed.toLowerCase())
  );

  // lista alla raser i dropdown
  const breeds = Array.from(new Set(dogs.map(d => d.breed || d.ras || "Okänd ras")));

  return (
    <section>
      <h2>Katalog</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Sök efter namn…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 6, marginRight: 8 }}
        />
        <select value={filterBreed} onChange={e => setFilterBreed(e.target.value)} style={{ padding: 6 }}>
          <option value="">Alla raser</option>
          {breeds.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
        {filteredDogs.map((d, idx) => {
          const dogId = d.chipNumber || d.id || String(idx);
          return (
            <Link key={dogId} to={`/dogs/${encodeURIComponent(dogId)}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article style={{ padding: 12, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", background: "white" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{d.name || "Namnlös"}</h3>
                <p style={{ margin: 0 }}>{d.breed || d.ras || "Okänd ras"} • {d.age ?? d.ålder ?? "-" } år</p>
                <p style={{ marginTop: 8, color: d.present ? "green" : "#666" }}>{d.present ? "På plats" : "Inte här"}</p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

