import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import DogDetail from "./pages/DogDetail";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Hem</Link> |{" "}
        <Link to="/catalog">Katalog</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/dogs/:id" element={<DogDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

