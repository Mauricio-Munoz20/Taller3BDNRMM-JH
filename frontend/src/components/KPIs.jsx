// Componente para mostrar los KPIs principales en la interfaz de usuario

function KPIs({ data }) {
  if (!data) return null;

  const formatCurrency = (value, showDecimals = false) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString(undefined, showDecimals ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 })}`;
  };

  const kpis = [
    {
      title: 'Total Ventas',
      value: formatCurrency(data.total_ventas || 0),
      color: 'var(--kpi-ventas-color, #4CAF50)',
      icon: '💰'
    },
    {
      title: 'Promedio Gasto',
      value: formatCurrency(data.promedio_gasto || 0, true),
      color: 'var(--kpi-promedio-color, #2196F3)',
      icon: '📊'
    },
    {
      title: 'Categoría Más Vendida',
      value: data.cat_mas_vendida || 'N/A',
      color: 'var(--kpi-cat-color, #FF9800)',
      icon: '🏷️'
    },
    {
      title: 'Producto Más Vendido',
      value: data.prod_mas_vendido || 'N/A',
      color: 'var(--kpi-prod-color, #9C27B0)',
      icon: '📦'
    },
    {
      title: 'Ciudad con Más Compras',
      value: data.ciudad_mas_compras || 'N/A',
      color: 'var(--kpi-ciudad-color, #E91E63)',
      icon: '🏙️'
    },
    {
      title: 'Método Más Usado',
      value: data.metodo_mas_usado || 'N/A',
      color: 'var(--kpi-metodo-color, #00BCD4)',
      icon: '💳'
    }
  ];

  return (
    <section className="kpis-container">
      <h2>📈 KPIs Principales</h2>
      <div className="kpis-grid">
        {kpis.map((kpi, index) => (
          <article key={index} className="kpi-card" style={{ '--kpi-border-color': kpi.color }}>
            <div className="kpi-card-header">
              <h3>{kpi.title}</h3>
              <span className="kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</span>
            </div>
            <p className="kpi-value" title={kpi.value}>{kpi.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default KPIs;
