// Componente para mostrar los KPIs principales en la interfaz de usuario

function KPIs({ data }) {
  if (!data) return null;

  const formatCurrency = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${Math.round(value).toLocaleString()}`;
  };

  const kpis = [
    {
      title: 'Total Ventas',
      value: formatCurrency(data.total_ventas || 0),
      color: '#4CAF50'
    },
    {
      title: 'Promedio Gasto',
      value: `$${Math.round(data.promedio_gasto || 0).toLocaleString()}`,
      color: '#2196F3'
    },
    {
      title: 'Categoría Más Vendida',
      value: data.cat_mas_vendida || 'N/A',
      color: '#FF9800'
    },
    {
      title: 'Producto Más Vendido',
      value: data.prod_mas_vendido || 'N/A',
      color: '#9C27B0'
    },
    {
      title: 'Ciudad con Más Compras',
      value: data.ciudad_mas_compras || 'N/A',
      color: '#E91E63'
    },
    {
      title: 'Método Más Usado',
      value: data.metodo_mas_usado || 'N/A',
      color: '#00BCD4'
    }
  ];

  return (
    <section className="kpis-container">
      <h2>📈 KPIs Principales</h2>
      <div className="kpis-grid">
        {kpis.map((kpi, index) => (
          <article key={index} className="kpi-card" style={{ borderLeft: `4px solid ${kpi.color}` }}>
            <h3>{kpi.title}</h3>
            <p className="kpi-value">{kpi.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default KPIs;
