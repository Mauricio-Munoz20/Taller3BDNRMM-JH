// Función para manejar los filtros dinámicos en la interfaz de usuario

function Filters({ filters, onFilterChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  return (
    <section className="filters">
      <h3>Filtros Dinámicos</h3>

      <div className="filters-grid">
        <div className="filter-row">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            id="ciudad"
            name="ciudad"
            type="text"
            value={filters.ciudad}
            onChange={handleChange}
            placeholder="Ingrese una ciudad"
          />
        </div>

        <div className="filter-row">
          <label htmlFor="categoria">Categoría</label>
          <input
            id="categoria"
            name="categoria"
            type="text"
            value={filters.categoria}
            onChange={handleChange}
            placeholder="Ingrese una categoría"
          />
        </div>

        <div className="filter-row">
          <label htmlFor="metodo_pago">Método de pago</label>
          <input
            id="metodo_pago"
            name="metodo_pago"
            type="text"
            value={filters.metodo_pago}
            onChange={handleChange}
            placeholder="Efectivo, tarjeta, etc."
          />
        </div>

        <div className="filter-row">
          <label htmlFor="fecha_inicio">Fecha inicio</label>
          <input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            value={filters.fecha_inicio}
            onChange={handleChange}
          />
        </div>

        <div className="filter-row">
          <label htmlFor="fecha_fin">Fecha fin</label>
          <input
            id="fecha_fin"
            name="fecha_fin"
            type="date"
            value={filters.fecha_fin}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}

export default Filters;
