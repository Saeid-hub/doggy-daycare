import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_DOGS_API;

export default function DogDetail() {
  const { id } = useParams(); 
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      setError("Ingen API-URL satt. Sätt REACT_APP_DOGS_API i .env");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Misslyckades hämta data: " + res.status);
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.record || data.records || data.data || []);
        // hitta baserat på chipNumber, id eller index-sträng
        const found = arr.find(d => (d.chipNumber && String(d.chipNumber) === decodeURIComponent(id))
                                  || (d.id && String(d.id) === decodeURIComponent(id))
                                  || String(d.chipNumber || d.id || "").toString() === decodeURIComponent(id));
        setDog(found || null);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Ett fel uppstod vid hämtning");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Laddar…</p>;
  if (error) return <p style={{ color: "crimson" }}>Fel: {error}</p>;
  if (!dog) return (
    <div>
      <p>Hunden hittades inte.</p>
      <Link to="/catalog">← Tillbaka</Link>
    </div>
  );

  return (
    <article style={{ maxWidth: 700 }}>
      {dog.img && <img src={dog.img} alt={dog.name} style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 400 }} />}
      <h2>{dog.name || "Namnlös"}</h2>
      <p><strong>Ras:</strong> {dog.breed || dog.ras || "-"}</p>
      <p><strong>Ålder:</strong> {dog.age ?? dog.ålder ?? "-" } år</p>
      <p><strong>Chipnummer / id:</strong> {dog.chipNumber || dog.id || "-"}</p>
      {dog.owner && <p><strong>Ägare:</strong> {dog.owner.name} {dog.owner.lastName || ""} — {dog.owner.phoneNumber || ""}</p>}
      <p><strong>Status:</strong> {dog.present ? 'På plats' : 'Inte här'}</p>

      <Link to="/catalog">← Tillbaka till katalogen</Link>
    </article>
  );
}

