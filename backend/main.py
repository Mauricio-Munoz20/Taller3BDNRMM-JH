from fastapi import FastAPI, HTTPException, Query, Response # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from db import conexion, importar_csv, db_lock
from queries import get_kpis, get_chart_data
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ejecuta tareas al iniciar y cerrar la aplicación."""
    importar_csv()  # Asegura que la base de datos esté poblada al iniciar
    print("Base de datos lista y KPIs disponibles.")
    yield
    print("Cerrando conexión a la base de datos.")
    try:
        conexion.close() # Liberamos el archivo .duckdb
        print("[OK] Conexion cerrada correctamente.")
    except Exception as e:
        print(f"[WARN] Error al cerrar: {e}")

app = FastAPI(title="API de Análisis de Compras", version="1.0", lifespan=lifespan)

# Configurar CORS para permitir solicitudes desde el frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/kpis")
def kpis(
    ciudad: str = Query(None, description="Filtrar por ciudad"),
    categoria: str = Query(None, description="Filtrar por categoría"),
    metodo_pago: str = Query(None, description="Filtrar por método de pago"),
    fecha_inicio: str = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    fecha_fin: str = Query(None, description="Fecha de fin (YYYY-MM-DD)")
):
    filters = {
        "ciudad": ciudad,
        "categoria": categoria,
        "metodo_pago": metodo_pago,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin
    }
    
    query, params = get_kpis(filters)
    with db_lock:
        result = conexion.execute(query, params).fetchone()
    
    # Safe check: retorna valores por defecto si no hay coincidencias
    if result and result[0] is not None:
        return {
            "total_ventas": float(result[0]),
            "promedio_gasto": float(result[1]) if result[1] else 0,
            "cat_mas_vendida": result[2],
            "prod_mas_vendido": result[3],
            "ciudad_mas_compras": result[4],
            "metodo_mas_usado": result[5]
        }
    
    return {
        "total_ventas": 0,
        "promedio_gasto": 0,
        "cat_mas_vendida": "N/A",
        "prod_mas_vendido": "N/A",
        "ciudad_mas_compras": "N/A",
        "metodo_mas_usado": "N/A"
    }
    
@app.get("/chart-data")
def chart_data(
    chart_type: str = Query(..., description="Tipo de gráfico: 'categoria' o 'ciudad'"),
    ciudad: str = Query(None, description="Filtrar por ciudad"),
    categoria: str = Query(None, description="Filtrar por categoría"),
    metodo_pago: str = Query(None, description="Filtrar por método de pago"),
    fecha_inicio: str = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    fecha_fin: str = Query(None, description="Fecha de fin (YYYY-MM-DD)")
):
    filters = {
        "ciudad": ciudad,
        "categoria": categoria,
        "metodo_pago": metodo_pago,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin
    }
    
    # Validacion explicita contra los 6 graficos del PDF
    valid_types = ["categoria", "ciudad", "edad", "fecha", "producto", "metodo_pago"]
    if chart_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Tipo invalido. Usa: {valid_types}")
    
    query, params = get_chart_data(chart_type, filters)
    with db_lock:
        results = conexion.execute(query, params).fetchall()
    
    # Retorna [] en lugar de 404 si no hay datos (mejor práctica para gráficos)
    return [{"label": row[0], "value": row[1]} for row in results]

@app.get("/")
def root():
    return {
        "message": "API de Análisis de Compras funcionando.",
        "endpoints": ["/kpis", "/chart-data?chart_type=categoria", "/docs"]
    }

@app.get("/favicon.ico")
def favicon() -> Response:
    return Response(status_code=204)

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)