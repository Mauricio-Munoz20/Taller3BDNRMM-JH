import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#daa520', '#00C49F', '#2196F3', '#FF8042', '#8884D8', '#9C27B0'];

// Componente personalizado para mostrar tooltips con formato de moneda
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = typeof value === 'number'
      ? value >= 1000
        ? `$${value.toLocaleString()}`
        : value
      : value;

    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{formattedValue}</p>
      </div>
    );
  }
  return null;
};

// Componente principal para mostrar los gráficos analíticos
function Charts({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <section className="charts-container">
      <h2>📊 Visualizaciones Analíticas</h2>

      <div className="charts-grid">
        {/* 1. Ventas por Categoría */}
        <article className="chart-card">
          <h3>Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.categoria || []} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCategoria" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
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
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
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
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
              >
                {(data.edad || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--chart-card-bg)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
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
                  <stop offset="5%" stopColor="#FF9800" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF9800" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
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
                  <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6A1B9A" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.15)" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis dataKey="label" type="category" width={110} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
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
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#00838F" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
              <Bar dataKey="value" fill="url(#colorMetodo)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}

export default Charts;
