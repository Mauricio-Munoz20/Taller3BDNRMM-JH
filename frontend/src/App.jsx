import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import Filters from "./components/Filters";
import KPIs from "./components/KPIs";
import Charts from "./components/Charts";
import "./App.css";

const API_BASE_URL = "http://localhost:8000";

// Componente principal de la aplicación que maneja el estado global, la lógica de filtrado y la obtención de datos
function App() {
  const [filters, setFilters] = useState({
    ciudad: "",
    categoria: "",
    fecha_inicio: "",
    fecha_fin: "",
    metodo_pago: ""
  });

  const [kpis, setKpis] = useState(null);
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const debounceTimer = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const buildQueryParams = (currentFilters) => {
    const params = new URLSearchParams(
      Object.entries(currentFilters)
        .filter(([, value]) => value !== "")
        .map(([key, value]) => [key, value])
    );

    return params.toString();
  };

  const fetchData = useCallback(async (currentFilters) => {
    setLoading(true);

    try {
      const queryString = buildQueryParams(currentFilters);
      const kpisUrl = `${API_BASE_URL}/kpis${queryString ? `?${queryString}` : ""}`;
      const kpisRes = await axios.get(kpisUrl);
      setKpis(kpisRes.data);

      const chartTypes = [
        "categoria",
        "ciudad",
        "edad",
        "fecha",
        "producto",
        "metodo_pago"
      ];

      const chartsPromises = chartTypes.map((type) => {
        const chartUrl = `${API_BASE_URL}/chart-data?chart_type=${encodeURIComponent(type)}${queryString ? `&${queryString}` : ""}`;
        return axios.get(chartUrl);
      });

      const chartsResponses = await Promise.all(chartsPromises);
      const chartsMap = chartTypes.reduce((acc, type, index) => {
        acc[type] = chartsResponses[index].data;
        return acc;
      }, {});

      setChartsData(chartsMap);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce: espera 600ms despues de la ultima tecla antes de hacer fetch
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchData(filters);
    }, 600);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, fetchData]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Plataforma de Analitica de Compras</h1>
            <p>Dashboard de 5 Millones de registros | DuckDB</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {theme === "light" ? (
              <><Moon size={16} /> Modo Oscuro</>
            ) : (
              <><Sun size={16} /> Modo Claro</>
            )}
          </button>
        </div>
      </header>

      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : (
        <>
          <KPIs data={kpis} />
          <Charts data={chartsData} />
        </>
      )}
    </div>
  );
}

export default App;