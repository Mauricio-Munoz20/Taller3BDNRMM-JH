import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FFD700', '#00C49F', '#2196F3', '#FF8042', '#9C27B0', '#FF1493'];

// Componente personalizado para mostrar tooltips con formato condicional según el tipo de métrica
const CustomTooltip = ({ active, payload, label, valueType }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const displayLabel = label ?? payload[0].name ?? payload[0].payload?.label;
    const formattedValue = typeof value === 'number'
      ? valueType === 'currency'
        ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} transacciones`
      : value;

    return (
      <div className="custom-tooltip">
        <p className="label">{displayLabel}</p>
        <p className="value" style={{ color: valueType === 'currency' ? 'var(--kpi-ventas-color, #4CAF50)' : 'var(--kpi-promedio-color, #2196F3)' }}>
          {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};

// Formateadores para los ejes de los gráficos
const formatCurrencyAxis = (value) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value}`;
};

const formatCountAxis = (value) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value;
};

// Función para renderizar porcentajes centrados en los segmentos del Donut Chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Componente principal para mostrar los gráficos analíticos
function Charts({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <section className="charts-container">
      <h2>Visualizaciones Analíticas</h2>

      <div className="charts-grid">
        {/* 1. Ventas por Categoría */}
        <article className="chart-card">
          <h3>Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.categoria || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCategoria" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.95} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatCurrencyAxis} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueType="currency" />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar dataKey="value" fill="url(#colorCategoria)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        {/* 2. Compras por Ciudad */}
        <article className="chart-card">
          <h3>Compras por Ciudad (Top 10)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.ciudad || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCiudad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.95} />
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatCountAxis} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueType="count" />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar dataKey="value" fill="url(#colorCiudad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        {/* 3. Compras por Rango Etario (Donut Chart) */}
        <article className="chart-card">
          <h3>Compras por Rango Etario</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.edad || []}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {(data.edad || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--chart-card-bg)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip valueType="count" />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </article>

        {/* 4. Ventas por Fecha */}
        <article className="chart-card">
          <h3>Ventas por Fecha</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.fecha || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorFecha" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9800" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#FF9800" stopOpacity={0.00} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatCurrencyAxis} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueType="currency" />} />
              <Area type="monotone" dataKey="value" stroke="#FF9800" strokeWidth={3} fillOpacity={1} fill="url(#colorFecha)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        {/* 5. Productos Más Vendidos */}
        <article className="chart-card">
          <h3>Top 10 Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.producto || []} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorProducto" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.95} />
                  <stop offset="95%" stopColor="#6A1B9A" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.12)" />
              <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={formatCurrencyAxis} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis dataKey="label" type="category" width={110} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueType="currency" />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar dataKey="value" fill="url(#colorProducto)" radius={[0, 6, 6, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        {/* 6. Métodos de Pago */}
        <article className="chart-card">
          <h3>Métodos de Pago Más Usados</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.metodo_pago || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorMetodo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.95} />
                  <stop offset="95%" stopColor="#00838F" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatCountAxis} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueType="count" />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar dataKey="value" fill="url(#colorMetodo)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}

export default Charts;
